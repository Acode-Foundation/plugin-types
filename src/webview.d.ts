declare namespace Acode {
	type WebViewMode = "fullscreen" | "hidden";

	type WebViewEventName =
		| "pageFinished"
		| "titleChanged"
		| "closed"
		| (string & {});

	interface WebViewCreateOptions {
		/**
		 * `"fullscreen"` opens the WebView in its own activity.
		 * `"hidden"` creates a headless WebView that is never displayed.
		 * @default "hidden"
		 */
		mode?: WebViewMode;
		/** Title shown in the fullscreen activity. */
		title?: string;
		/**
		 * Whether the page is allowed to navigate.
		 * When `false`, all in-page navigation is blocked.
		 * @default true
		 */
		allowNavigation?: boolean;
		/**
		 * Enables downloads via the system DownloadManager.
		 * @default false
		 */
		allowDownloads?: boolean;
		/**
		 * Whether a fullscreen WebView is shown immediately.
		 * When `false`, call {@link WebViewInstance.show} later.
		 * @default true
		 */
		visible?: boolean;
	}

	interface WebViewPageFinishedData {
		url?: string;
		title?: string;
	}

	interface WebViewTitleChangedData {
		title?: string;
	}

	type WebViewEventData =
		| WebViewPageFinishedData
		| WebViewTitleChangedData
		| Record<string, unknown>
		| undefined;

	type WebViewMessageCallback = (message: unknown) => void;

	type WebViewEventCallback = (
		event: WebViewEventName,
		data: WebViewEventData,
	) => void;

	interface WebViewInstance {
		/** Unique instance id (e.g. `wv_1a2b3c4d5e6f`). */
		readonly id: string;

		/**
		 * Loads a URL. Only `http://` and `https://` are allowed.
		 * Input without a scheme is loaded over `https`.
		 */
		loadURL(url: string): Promise<void>;

		/** Loads an HTML string directly. */
		loadHTML(html: string): Promise<void>;

		/** Evaluates JavaScript in the page and resolves with the result. */
		evaluate(js: string): Promise<unknown>;

		/**
		 * Sends a message to the page.
		 * Non-string values are JSON-stringified.
		 */
		postMessage(message: unknown): Promise<void>;

		/** Registers a callback for messages sent from the page. */
		onMessage(callback: WebViewMessageCallback): void;

		/** Removes a previously registered message callback. */
		offMessage(callback: WebViewMessageCallback): void;

		/** Registers a listener for lifecycle events. */
		on(event: WebViewEventName, callback: WebViewEventCallback): void;

		/** Removes a previously registered event listener. */
		off(event: WebViewEventName, callback: WebViewEventCallback): void;

		/** Shows a fullscreen WebView (or restores it after {@link hide}). */
		show(): Promise<void>;

		/** Backgrounds a fullscreen WebView without destroying page state. */
		hide(): Promise<void>;

		/** Reloads the current page. */
		reload(): Promise<void>;

		/**
		 * Destroys the instance and releases native resources.
		 * Must be called when the WebView is no longer needed.
		 */
		destroy(): Promise<void>;
	}

	/**
	 * Native WebView plugin API (`acode.require("webview")`).
	 * Available from the WebView Plugin API release (v1.12.7+).
	 */
	interface WebViewApi {
		create(options?: WebViewCreateOptions): Promise<WebViewInstance>;
	}
}
