import { useCallback } from "react";
import { toast } from "react-toastify";

export const useSerialRFID = () => {
  const readCard = useCallback(async (onCardRead) => {
    if (!("serial" in navigator)) {
      toast.error("Web Serial API not supported in this browser.");
      return;
    }

    let port = null;
    let reader = null;
    let timeout = null;

    try {
      // @ts-ignore
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });
      reader = port.readable.getReader();

      toast.info("Hold RFID card near the reader...");
      let buffer = new Uint8Array();

      timeout = setTimeout(async () => {
        try {
          if (reader) {
            await reader.cancel();
            reader.releaseLock();
          }
          if (port) {
            await port.close();
          }
        } catch (e) {
          console.error("Timeout cleanup error:", e);
        }
        toast.warning("Card reading timed out. Please try again.");
      }, 30000);

      while (true) {
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
              await port.close();
              return;
            }
          }
        }
      }

      clearTimeout(timeout);
      reader.releaseLock();
      await port.close();
    } catch (error) {
      console.error("Serial read failed:", error);
      clearTimeout(timeout);

      try {
        if (reader) {
          await reader.cancel();
          reader.releaseLock();
        }
        if (port) {
          await port.close();
        }
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }

      if (error.name === "NotAllowedError") {
        toast.error("Serial port access denied. Please grant permission.");
      } else if (error.name === "NetworkError") {
        toast.error("Serial port connection failed. Check your device.");
      } else {
        toast.error("Failed to read card from device.");
      }
    }
  }, []);

  return { readCard };
};
