import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Check, X, ChevronDown, ChevronUp, Usb, RefreshCw, Lock, Unlock } from 'lucide-react';

const ParkingKiosk = () => {
    // State for serial connection
    const [isConnected, setIsConnected] = useState(false);
    const [port, setPort] = useState(null);
    const [availablePorts, setAvailablePorts] = useState([]);
    const [connectionError, setConnectionError] = useState(null);

    // State for gate control
    const [gateStatus, setGateStatus] = useState('closed'); // 'closed', 'opening', 'open', 'closing'

    // State for card scan
    const [lastCardScan, setLastCardScan] = useState(null);
    const [scanStatus, setScanStatus] = useState(null); // 'success', 'error', 'pending', null

    // State for messages
    const [messages, setMessages] = useState([]);
    const [manualCommand, setManualCommand] = useState('');

    // Refs
    const reader = useRef(null);
    const writer = useRef(null);
    const readLoopActive = useRef(false);
    const messagesEndRef = useRef(null);

    // Check if Web Serial API is supported
    const isSerialSupported = () => {
        return 'serial' in navigator;
    };

    // Connect to ESP32 via USB
    const connectToDevice = async () => {
        if (!isSerialSupported()) {
            setConnectionError('Web Serial API is not supported in this browser. Try Chrome or Edge.');
            return;
        }

        try {
            // Request port access
            const selectedPort = await navigator.serial.requestPort();
            setPort(selectedPort);

            // Open the port with appropriate settings for ESP32
            await selectedPort.open({
                baudRate: 115200,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                flowControl: 'none'
            });

            // Create reader and writer
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = selectedPort.readable.pipeTo(textDecoder.writable);
            reader.current = textDecoder.readable.getReader();

            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(selectedPort.writable);
            writer.current = textEncoder.writable.getWriter();

            // Start reading loop
            readLoopActive.current = true;
            readLoop();

            // Update state
            setIsConnected(true);
            setConnectionError(null);

            // Send initial status request
            sendCommand('STATUS');

            addMessage('system', 'Connected to ESP32 device');
        } catch (error) {
            console.error('Error connecting to serial device:', error);
            setConnectionError(`Failed to connect: ${error.message}`);
        }
    };

    // Disconnect from device
    const disconnectFromDevice = async () => {
        if (reader.current) {
            readLoopActive.current = false;
            reader.current.cancel();
            reader.current = null;
        }

        if (writer.current) {
            writer.current.close();
            writer.current = null;
        }

        if (port) {
            await port.close();
            setPort(null);
        }

        setIsConnected(false);
        addMessage('system', 'Disconnected from ESP32 device');
    };

    // Read loop for incoming data
    const readLoop = async () => {
        while (readLoopActive.current && reader.current) {
            try {
                const { value, done } = await reader.current.read();
                if (done) {
                    break;
                }

                // Process incoming data
                processIncomingData(value);
            } catch (error) {
                console.error('Error reading data:', error);
                addMessage('error', `Read error: ${error.message}`);
                break;
            }
        }

        if (isConnected) {
            setIsConnected(false);
            addMessage('error', 'Connection lost');
        }
    };

    // Process incoming data from ESP32
    const processIncomingData = (data) => {
        // Split by newlines in case multiple messages arrive at once
        const messages = data.split('\n').filter(msg => msg.trim() !== '');

        messages.forEach(message => {
            // Log raw message
            addMessage('received', message);

            // Parse and handle different message types
            if (message.includes('CARD_SCAN:')) {
                const cardId = message.split('CARD_SCAN:')[1].trim();
                setLastCardScan({
                    id: cardId,
                    timestamp: new Date().toLocaleTimeString()
                });
                setScanStatus('pending');

                // Simulate a response after a short delay (in a real app, this would be based on your business logic)
                setTimeout(() => {
                    const isAuthorized = Math.random() > 0.3; // 70% chance of success for demo
                    setScanStatus(isAuthorized ? 'success' : 'error');

                    if (isAuthorized) {
                        sendCommand('OPEN_GATE');
                        addMessage('system', `Card ${cardId} authorized. Opening gate.`);
                    } else {
                        addMessage('system', `Card ${cardId} not authorized. Access denied.`);
                    }
                }, 1000);
            }
            else if (message.includes('GATE_STATUS:')) {
                const status = message.split('GATE_STATUS:')[1].trim().toLowerCase();
                setGateStatus(status);
            }
            else if (message.includes('ERROR:')) {
                addMessage('error', message);
            }
        });
    };

    // Send command to ESP32
    const sendCommand = async (command) => {
        if (!isConnected || !writer.current) {
            addMessage('error', 'Cannot send command: Not connected');
            return;
        }

        try {
            await writer.current.write(command + '\n');
            addMessage('sent', command);
        } catch (error) {
            console.error('Error sending command:', error);
            addMessage('error', `Send error: ${error.message}`);
        }
    };

    // Control gate
    const controlGate = (action) => {
        if (action === 'open' && gateStatus !== 'open' && gateStatus !== 'opening') {
            sendCommand('OPEN_GATE');
        } else if (action === 'close' && gateStatus !== 'closed' && gateStatus !== 'closing') {
            sendCommand('CLOSE_GATE');
        }
    };

    // Add message to log
    const addMessage = (type, text) => {
        const newMessage = {
            id: Date.now(),
            type,
            text,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev.slice(-99), newMessage]); // Keep last 100 messages
    };

    // Handle manual command submission
    const handleManualCommandSubmit = (e) => {
        e.preventDefault();
        if (manualCommand.trim()) {
            sendCommand(manualCommand.trim());
            setManualCommand('');
        }
    };

    // Scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Check for available ports on mount
    useEffect(() => {
        const checkPorts = async () => {
            if (isSerialSupported()) {
                try {
                    const ports = await navigator.serial.getPorts();
                    setAvailablePorts(ports);
                } catch (error) {
                    console.error('Error checking ports:', error);
                }
            }
        };

        checkPorts();
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (isConnected) {
                disconnectFromDevice();
            }
        };
    }, [isConnected]);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">
                <header className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Parking Kiosk Control</h1>
                        <p className="text-gray-500">ESP32 Gate Management Interface</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full flex items-center ${
                            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                isConnected ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>

                        <button
                            onClick={isConnected ? disconnectFromDevice : connectToDevice}
                            className={`px-4 py-2 rounded-md flex items-center ${
                                isConnected
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            <Usb className="h-4 w-4 mr-2" />
                            {isConnected ? 'Disconnect' : 'Connect Device'}
                        </button>
                    </div>
                </header>

                {connectionError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Connection Error</p>
                            <p>{connectionError}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Gate Control Panel */}
                    <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-1">
                        <h2 className="text-lg font-medium mb-4 pb-2 border-b">Gate Control</h2>

                        <div className="flex flex-col items-center">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${
                                gateStatus === 'open' ? 'bg-green-100' :
                                    gateStatus === 'closed' ? 'bg-red-100' :
                                        'bg-yellow-100'
                            }`}>
                                {gateStatus === 'open' ? (
                                    <Unlock className="h-16 w-16 text-green-600" />
                                ) : gateStatus === 'closed' ? (
                                    <Lock className="h-16 w-16 text-red-600" />
                                ) : gateStatus === 'opening' ? (
                                    <ChevronUp className="h-16 w-16 text-yellow-600" />
                                ) : (
                                    <ChevronDown className="h-16 w-16 text-yellow-600" />
                                )}
                            </div>

                            <div className="text-center mb-6">
                                <p className="text-lg font-medium capitalize">
                                    Gate is {gateStatus}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button
                                    onClick={() => controlGate('open')}
                                    disabled={gateStatus === 'open' || gateStatus === 'opening'}
                                    className={`py-3 px-4 rounded-md flex items-center justify-center ${
                                        gateStatus === 'open' || gateStatus === 'opening'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    <ChevronUp className="h-5 w-5 mr-2" />
                                    Open Gate
                                </button>

                                <button
                                    onClick={() => controlGate('close')}
                                    disabled={gateStatus === 'closed' || gateStatus === 'closing'}
                                    className={`py-3 px-4 rounded-md flex items-center justify-center ${
                                        gateStatus === 'closed' || gateStatus === 'closing'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                >
                                    <ChevronDown className="h-5 w-5 mr-2" />
                                    Close Gate
                                </button>
                            </div>

                            <button
                                onClick={() => sendCommand('STATUS')}
                                className="mt-4 py-2 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center w-full"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Status
                            </button>
                        </div>
                    </div>

                    {/* Card Scan Panel */}
                    <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
                        <h2 className="text-lg font-medium mb-4 pb-2 border-b">Card Scan Status</h2>

                        {lastCardScan ? (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Last Card Scanned</p>
                                        <p className="text-xl font-mono font-medium">{lastCardScan.id}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Scanned at {lastCardScan.timestamp}
                                        </p>
                                    </div>

                                    <div>
                                        {scanStatus === 'success' && (
                                            <div className="bg-green-100 text-green-800 rounded-full p-2">
                                                <Check className="h-6 w-6" />
                                            </div>
                                        )}
                                        {scanStatus === 'error' && (
                                            <div className="bg-red-100 text-red-800 rounded-full p-2">
                                                <X className="h-6 w-6" />
                                            </div>
                                        )}
                                        {scanStatus === 'pending' && (
                                            <div className="bg-yellow-100 text-yellow-800 rounded-full p-2">
                                                <div className="h-6 w-6 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="font-medium">
                                        {scanStatus === 'success' && 'Access Granted'}
                                        {scanStatus === 'error' && 'Access Denied'}
                                        {scanStatus === 'pending' && 'Verifying...'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {scanStatus === 'success' && 'Card is authorized. Gate is opening.'}
                                        {scanStatus === 'error' && 'Card is not authorized. Access denied.'}
                                        {scanStatus === 'pending' && 'Checking card authorization...'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 mb-4 text-center">
                                <p className="text-gray-500">No card scanned yet</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    When a card is scanned, details will appear here
                                </p>
                            </div>
                        )}

                        <h3 className="text-md font-medium mb-2">Manual Command</h3>
                        <form onSubmit={handleManualCommandSubmit} className="flex mb-4">
                            <input
                                type="text"
                                value={manualCommand}
                                onChange={(e) => setManualCommand(e.target.value)}
                                placeholder="Enter command (e.g., OPEN_GATE, STATUS)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!isConnected}
                                className={`px-4 py-2 rounded-r-md ${
                                    isConnected
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Send
                            </button>
                        </form>

                        <h3 className="text-md font-medium mb-2">Communication Log</h3>
                        <div className="bg-gray-900 text-gray-100 rounded-md p-2 h-64 overflow-y-auto font-mono text-sm">
                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No messages yet</p>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className={`mb-1 ${
                                        msg.type === 'sent' ? 'text-blue-400' :
                                            msg.type === 'received' ? 'text-green-400' :
                                                msg.type === 'error' ? 'text-red-400' :
                                                    'text-gray-400'
                                    }`}>
                                        <span className="opacity-70">[{msg.timestamp}]</span>{' '}
                                        <span className="font-bold">
                      {msg.type === 'sent' ? '→ SENT:' :
                          msg.type === 'received' ? '← RECV:' :
                              msg.type === 'error' ? '! ERROR:' :
                                  '• SYS:'}
                    </span>{' '}
                                        {msg.text}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingKiosk;