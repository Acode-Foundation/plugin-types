/**
 * Ready state constants for WebSocket connection.
 */
type WebSocketReadyState = 0 | 1 | 2 | 3;

/**
 * Binary type for WebSocket messages.
 * Note: 'blob' is not supported but checked for browser compatibility.
 */
type WebSocketBinaryType = "" | "arraybuffer" | "blob";

/**
 * Event handler type for WebSocket open events.
 */
type WebSocketOpenHandler = (event: Event) => void;

/**
 * Extended MessageEvent with binary indicator.
 */
interface WebSocketMessageEvent extends MessageEvent {
	readonly binary: boolean;
}

/**
 * Event handler type for WebSocket message events.
 */
type WebSocketMessageHandler = (event: WebSocketMessageEvent) => void;

/**
 * Event handler type for WebSocket close events.
 */
type WebSocketCloseHandler = (event: CloseEvent) => void;

/**
 * Extended Error event with optional message property.
 */
interface WebSocketErrorEvent extends Event {
	message?: string;
}

/**
 * Event handler type for WebSocket error events.
 */
type WebSocketErrorHandler = (event: WebSocketErrorEvent) => void;

/**
 * Represents an active WebSocket connection instance.
 * Extends EventTarget for native event handling support.
 */
interface CordovaWebSocketInstance extends EventTarget {
	/**
	 * Unique identifier for this WebSocket instance.
	 */
	readonly instanceId: string;

	/**
	 * The extensions selected by the server.
	 */
	readonly extensions: string;

	/**
	 * The current state of the connection.
	 * - 0: CONNECTING
	 * - 1: OPEN
	 * - 2: CLOSING
	 * - 3: CLOSED
	 */
	readonly readyState: WebSocketReadyState;

	/**
	 * The URL of the WebSocket connection.
	 */
	readonly url: string;

	/**
	 * The binary data type used by the connection.
	 * Set to 'arraybuffer' to receive binary data as ArrayBuffer.
	 * Empty string means text mode (default).
	 */
	binaryType: WebSocketBinaryType;

	/**
	 * Event handler called when the connection is opened.
	 */
	onopen: WebSocketOpenHandler | null;

	/**
	 * Event handler called when a message is received.
	 */
	onmessage: WebSocketMessageHandler | null;

	/**
	 * Event handler called when the connection is closed.
	 */
	onclose: WebSocketCloseHandler | null;

	/**
	 * Event handler called when an error occurs.
	 */
	onerror: WebSocketErrorHandler | null;

	/**
	 * Sends data through the WebSocket connection.
	 *
	 * @param message - The data to send. Can be a string, ArrayBuffer, or ArrayBufferView.
	 * @param binary - If true, sends the message as binary data. For ArrayBuffer/ArrayBufferView, this is automatically set to true.
	 * @throws Error if the WebSocket is not in OPEN state.
	 *
	 * @example
	 * // Send text message
	 * ws.send('Hello, World!');
	 *
	 * // Send binary data
	 * const buffer = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
	 * ws.send(buffer);
	 */
	send(message: string | ArrayBuffer | ArrayBufferView, binary?: boolean): void;

	/**
	 * Closes the WebSocket connection.
	 *
	 * @param code - The status code explaining why the connection is being closed.
	 * @param reason - A human-readable string explaining why the connection is being closed.
	 *
	 * @example
	 * ws.close(1000, 'Normal closure');
	 */
	close(code?: number, reason?: string): void;
}

/**
 * Static constants for WebSocket ready states.
 */
interface CordovaWebSocketInstanceStatic {
	readonly CONNECTING: 0;
	readonly OPEN: 1;
	readonly CLOSING: 2;
	readonly CLOSED: 3;
}

/**
 * Cordova WebSocket plugin interface.
 * Provides native WebSocket functionality for Cordova applications.
 * Available globally at `cordova.websocket`.
 */
interface CordovaWebSocket {
	/**
	 * Whether to log debug messages.
	 */
	DEBUG: boolean;

	/**
	 * Creates a new WebSocket connection to the specified URL.
	 *
	 * @param url - The URL to connect to (e.g., 'wss://example.com/socket').
	 * @param protocols - Optional subprotocol(s) to use.
	 * @param headers - Optional custom headers to send with the connection request.
	 * @param binaryType - Optional binary type for the connection ('arraybuffer' or empty string).
	 * @returns Promise resolving to a WebSocketInstance on successful connection.
	 *
	 * @example
	 * const ws = await cordova.websocket.connect('wss://echo.websocket.org');
	 * ws.onmessage = (event) => console.log('Received:', event.data);
	 * ws.send('Hello!');
	 */
	connect(
		url: string,
		protocols?: string | string[] | null,
		headers?: Record<string, string> | null,
		binaryType?: WebSocketBinaryType,
	): Promise<CordovaWebSocketInstance>;

	/**
	 * Lists all active WebSocket client instance IDs.
	 *
	 * @returns Promise resolving to an array of active instance IDs.
	 *
	 * @example
	 * const clients = await cordova.websocket.listClients();
	 * console.log('Active connections:', clients);
	 */
	listClients(): Promise<string[]>;

	/**
	 * Utility function to send a message through a WebSocket by its instance ID.
	 * Useful when you've lost the reference to the WebSocketInstance object.
	 *
	 * @param instanceId - The ID of the WebSocket instance.
	 * @param message - The data to send. Can be a string, ArrayBuffer, or ArrayBufferView.
	 * @param binary - If true, sends the message as binary data.
	 * @returns Promise resolving when the message is sent.
	 *
	 * @example
	 * await cordova.websocket.send('instance-123', 'Hello!');
	 */
	send(
		instanceId: string,
		message: string | ArrayBuffer | ArrayBufferView,
		binary?: boolean,
	): Promise<void>;

	/**
	 * Utility function to close a WebSocket connection by its instance ID.
	 * Useful when you've lost the reference to the WebSocketInstance object.
	 *
	 * @param instanceId - The ID of the WebSocket instance to close.
	 * @param code - Optional status code explaining why the connection is being closed.
	 * @param reason - Optional human-readable string explaining why the connection is being closed.
	 * @returns Promise resolving when the close operation has completed.
	 *
	 * @example
	 * await cordova.websocket.close('instance-123', 1000, 'Done');
	 */
	close(instanceId: string, code?: number, reason?: string): Promise<void>;
}

interface Cordova {
	/**
	 * Native WebSocket plugin providing WebSocket functionality.
	 */
	websocket: CordovaWebSocket;
}

declare const cordova: Cordova;
