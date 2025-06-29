import { useCallback, useRef } from "react";
import { toast } from "react-toastify";

export const useSerialRFID = () => {
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const isCancellingRef = useRef(false);

 const readCard = useCallback(async (onCardRead) => {
    if (!("serial" in navigator)) {
      toast.error("Web Serial API not supported in this browser.");
      return;
    }

    let timeout = null;

    try {
      console.log("Requesting serial port...");

      // @ts-ignore
      const port = await navigator.serial.requestPort();
      console.log("Port requested, opening...");
      
      await port.open({ baudRate: 115200 });
      console.log("Port opened, waiting for device to stabilize...");
      
      portRef.current = port;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const tempReader = port.readable.getReader();
      try {
        const clearBufferTimeout = setTimeout(() => {
          tempReader.cancel().catch(() => {});
        }, 1000);

        while (true) {
          try {
            const result = await Promise.race([
              tempReader.read(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('timeout')), 100)
              )
            ]);
            
            if (result.done) break;
            console.log("Discarding initial data:", new TextDecoder().decode(result.value));
          } catch (e) {
            // Timeout or other error, stop clearing buffer
            break;
          }
        }
        
        clearTimeout(clearBufferTimeout);
        tempReader.releaseLock();
      } catch (e) {
        console.log("Buffer clearing completed:", e.message);
        try {
          tempReader.releaseLock();
        } catch (releaseError) {
          // Reader might already be released
        }
      }

      // Now create the actual reader for card reading
      const reader = port.readable.getReader();
      readerRef.current = reader;

      toast.info("Hold RFID card near the reader...");

      let buffer = new Uint8Array();

      timeout = setTimeout(async () => {
        try {
          if (readerRef.current) {
            await readerRef.current.cancel();
            readerRef.current.releaseLock();
            readerRef.current = null;
          }
          if (portRef.current) {
            await portRef.current.close();
            portRef.current = null;
          }
        } catch (e) {
          console.error("Timeout cleanup error:", e);
        }
        toast.warning("Card reading timed out. Please try again.");
      }, 30000);

      while (true) {
        try {
          const { value, done } = await reader.read();
          if (done) break;

          const newBuffer = new Uint8Array(buffer.length + value.length);
          newBuffer.set(buffer);
          newBuffer.set(value, buffer.length);
          buffer = newBuffer;

          const text = new TextDecoder().decode(buffer);
          const lines = text.split(/\r?\n/);

          if (lines.length > 1) {
            const lastLine = lines.pop();
            buffer = new TextEncoder().encode(lastLine || "");

            for (const line of lines) {
              const trimmedLine = line.trim();
              let cardId = "";

              if (trimmedLine.startsWith("CARD:")) {
                cardId = trimmedLine.substring(5).trim().toUpperCase();
              } else if (
                /^[0-9A-Fa-f]+$/.test(trimmedLine) &&
                trimmedLine.length >= 8
              ) {
                cardId = trimmedLine.toUpperCase();
              }

              if (cardId) {
                clearTimeout(timeout);
                toast.success(`Card read successfully: ${cardId}`);
                onCardRead(cardId);

                await reader.cancel();
                reader.releaseLock();
                readerRef.current = null;

                await port.close();
                portRef.current = null;

                return;
              }
            }
          }
        } catch (readError) {
          // Handle framing errors gracefully
          if (readError.name === 'FramingError') {
            console.warn("Framing error detected, continuing...");
            // Continue reading, don't break the loop
            continue;
          } else {
            // Re-throw other errors
            throw readError;
          }
        }
      }

      clearTimeout(timeout);
      reader.releaseLock();
      readerRef.current = null;

      await port.close();
      portRef.current = null;
    } catch (error) {
      console.error("Serial read failed:", error);
      clearTimeout(timeout);

      try {
        if (readerRef.current) {
          await readerRef.current.cancel();
          readerRef.current.releaseLock();
          readerRef.current = null;
        }
        if (portRef.current) {
          await portRef.current.close();
          portRef.current = null;
        }
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }

      if (error.name === "NotAllowedError") {
        toast.error("Serial port access denied. Please grant permission.");
      } else if (error.name === "NetworkError") {
        toast.error("Serial port connection failed. Check your device.");
      } else if (error.name === "FramingError") {
        toast.error("Device communication error. Please try again.");
      } else {
        toast.error("Failed to read card from device.");
      }
    }
  }, []);

  const cancelRead = useCallback(async () => {
    if (isCancellingRef.current) {
      console.warn("Cancel already in progress.");
      return;
    }

    isCancellingRef.current = true;

    try {
      // Store references before nullifying them
      const currentReader = readerRef.current;
      const currentPort = portRef.current;

      // Clear the refs first to prevent race conditions
      readerRef.current = null;
      portRef.current = null;

      if (currentReader) {
        try {
          await currentReader.cancel();
        } catch (e) {
          console.warn("Reader cancel error:", e);
        }
        try {
          currentReader.releaseLock();
        } catch (e) {
          console.warn("Reader releaseLock error:", e);
        }
      }

      if (currentPort) {
        // Delay to avoid calling `close()` too early
        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          await currentPort.close();
        } catch (e) {
          if (e.name === "InvalidStateError") {
            console.warn("Port already closing or closed:", e);
          } else {
            console.error("Port close error:", e);
            toast.error("Failed to close serial port.");
          }
        }
      }

      toast.info("Card reading canceled.");
    } catch (error) {
      console.error("Error cancelling RFID read:", error);
      toast.error("Failed to cancel card reading.");
    } finally {
      isCancellingRef.current = false;
    }
  }, []);

  return { readCard, cancelRead };
};