/**
 * Shortcut configuration for adding app shortcuts.
 */
interface SystemShortcut {
	/** Unique identifier for the shortcut. */
	id: string;
	/** Display label for the shortcut. */
	label: string;
	/** Description of the shortcut. */
	description: string;
	/** Icon for the shortcut (base64 or resource path). */
	icon: string;
	/** Action to perform when shortcut is activated. */
	action: string;
	/** Additional data to pass with the shortcut. */
	data: string;
}

/**
 * Application information returned by getAppInfo.
 */
interface SystemAppInfo {
	/** Application package name. */
	packageName: string;
	/** Application version name. */
	versionName: string;
	/** Application version code. */
	versionCode: number;
	/** Application label/name. */
	label: string;
}

/**
 * WebView information returned by getWebviewInfo.
 */
interface SystemWebviewInfo {
	/** WebView package name. */
	packageName: string;
	/** WebView version. */
	versionName: string;
}

/**
 * In-app browser instance returned by inAppBrowser.
 */
interface SystemInAppBrowser {
	/** Callback when an external browser is opened. */
	onOpenExternalBrowser: ((url: string) => void) | null;
	/** Callback when an error occurs. */
	onError: ((error: string) => void) | null;
}

/**
 * Intent data received by the intent handler.
 */
interface SystemIntent {
	/** The action of the intent. */
	action?: string;
	/** The data URI of the intent. */
	data?: string;
	/** The MIME type of the intent data. */
	type?: string;
	/** Extra data bundled with the intent. */
	extras?: Record<string, unknown>;
}

/**
 * Success callback type.
 */
type SystemSuccessCallback<T = string> = (result: T) => void;

/**
 * Error callback type.
 */
type SystemErrorCallback = (error: string) => void;

/**
 * System plugin providing native Android functionality for Cordova applications.
 * Available globally as `system`.
 */
interface System {
	/**
	 * Checks if MANAGE_EXTERNAL_STORAGE permission is declared in AndroidManifest.xml.
	 * @param success - Callback with boolean result.
	 * @param error - Error callback.
	 */
	isManageExternalStorageDeclared(
		success: SystemSuccessCallback<boolean>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Checks if storage manager permission has been granted.
	 * @param success - Callback with boolean result.
	 * @param error - Error callback.
	 */
	hasGrantedStorageManager(
		success: SystemSuccessCallback<boolean>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Requests storage manager permission from the user.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	requestStorageManager(
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Copies a file from source URI to destination URI.
	 * @param srcUri - Source file URI.
	 * @param destUri - Destination directory URI.
	 * @param fileName - Name for the copied file.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	copyToUri(
		srcUri: string,
		destUri: string,
		fileName: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Checks if a file exists at the given path.
	 * @param path - File path to check.
	 * @param countSymlinks - Whether to follow symlinks.
	 * @param success - Callback with result (1 if exists, 0 if not).
	 * @param error - Error callback.
	 */
	fileExists(
		path: string,
		countSymlinks: boolean,
		success: SystemSuccessCallback<number>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Creates a symbolic link.
	 * @param target - Target path the symlink points to.
	 * @param linkPath - Path where the symlink will be created.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	createSymlink(
		target: string,
		linkPath: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Writes text content to a file.
	 * @param path - File path to write to.
	 * @param content - Text content to write.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	writeText(
		path: string,
		content: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Deletes a file at the given path.
	 * @param path - File path to delete.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	deleteFile(
		path: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Sets the executable permission on a file.
	 * @param path - File path.
	 * @param executable - Whether to make the file executable.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	setExec(
		path: string,
		executable: boolean,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Gets the native library path for the application.
	 * @param success - Callback with the library path.
	 * @param error - Error callback.
	 */
	getNativeLibraryPath(
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Gets the application's files directory path.
	 * @param success - Callback with the files directory path.
	 * @param error - Error callback.
	 */
	getFilesDir(success: SystemSuccessCallback, error: SystemErrorCallback): void;

	/**
	 * Gets the parent directory path of a given path.
	 * @param path - File or directory path.
	 * @param success - Callback with the parent path.
	 * @param error - Error callback.
	 */
	getParentPath(
		path: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Lists children of a directory.
	 * @param path - Directory path.
	 * @param success - Callback with array of child names.
	 * @param error - Error callback.
	 */
	listChildren(
		path: string,
		success: SystemSuccessCallback<string[]>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Creates directories recursively (like mkdir -p).
	 * @param path - Directory path to create.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	mkdirs(
		path: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Gets the device CPU architecture.
	 * @param success - Callback with architecture string (e.g., 'arm64-v8a', 'armeabi-v7a', 'x86_64').
	 * @param error - Error callback.
	 */
	getArch(
		success: SystemSuccessCallback<
			"arm64-v8a" | "armeabi-v7a" | "x86_64" | "x86"
		>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Clears the application cache.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	clearCache(success: SystemSuccessCallback, error: SystemErrorCallback): void;

	/**
	 * Gets information about the WebView.
	 * @param success - Callback with WebView info.
	 * @param error - Error callback.
	 */
	getWebviewInfo(
		success: SystemSuccessCallback<SystemWebviewInfo>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Checks if device is in power save mode.
	 * @param success - Callback with boolean result.
	 * @param error - Error callback.
	 */
	isPowerSaveMode(
		success: SystemSuccessCallback<boolean>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Performs a file action using Android intents.
	 * @param fileUri - URI of the file.
	 * @param filename - Optional filename.
	 * @param action - Action to perform (e.g., 'VIEW', 'SEND', 'EDIT').
	 * @param mimeType - MIME type of the file.
	 * @param onFail - Error callback.
	 */
	fileAction(
		fileUri: string,
		filename: string,
		action: string,
		mimeType: string,
		onFail?: SystemErrorCallback,
	): void;

	/**
	 * Performs a file action using Android intents (without filename).
	 * @param fileUri - URI of the file.
	 * @param action - Action to perform (e.g., 'VIEW', 'SEND', 'EDIT').
	 * @param mimeType - MIME type of the file.
	 * @param onFail - Error callback.
	 */
	fileAction(
		fileUri: string,
		action: string,
		mimeType: string,
		onFail?: SystemErrorCallback,
	): void;

	/**
	 * Gets application information.
	 * @param success - Callback with app info.
	 * @param error - Error callback.
	 */
	getAppInfo(
		success: SystemSuccessCallback<SystemAppInfo>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Adds a dynamic app shortcut.
	 * @param shortcut - Shortcut configuration.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	addShortcut(
		shortcut: SystemShortcut,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Removes a dynamic app shortcut.
	 * @param id - Shortcut ID to remove.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	removeShortcut(
		id: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Pins a shortcut to the home screen.
	 * @param id - Shortcut ID to pin.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	pinShortcut(
		id: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Requests MANAGE_EXTERNAL_STORAGE permission (All Files Access).
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	manageAllFiles(
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Gets the Android SDK version.
	 * @param success - Callback with version number.
	 * @param error - Error callback.
	 */
	getAndroidVersion(
		success: SystemSuccessCallback<number>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Checks if the app is an external storage manager.
	 * @param success - Callback with boolean result.
	 * @param error - Error callback.
	 */
	isExternalStorageManager(
		success: SystemSuccessCallback<boolean>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Requests a single Android permission.
	 * @param permission - Permission to request (e.g., 'android.permission.CAMERA').
	 * @param success - Callback with grant result.
	 * @param error - Error callback.
	 */
	requestPermission(
		permission: string,
		success: SystemSuccessCallback<boolean>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Requests multiple Android permissions.
	 * @param permissions - Array of permissions to request.
	 * @param success - Callback with grant results.
	 * @param error - Error callback.
	 */
	requestPermissions(
		permissions: string[],
		success: SystemSuccessCallback<Record<string, boolean>>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Checks if a permission has been granted.
	 * @param permission - Permission to check.
	 * @param success - Callback with boolean result.
	 * @param error - Error callback.
	 */
	hasPermission(
		permission: string,
		success: SystemSuccessCallback<boolean>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Opens a URL in the default browser.
	 * @param src - URL to open.
	 */
	openInBrowser(src: string): void;

	/**
	 * Launches an Android application.
	 * @param app - Package name of the app to launch.
	 * @param className - Optional class name to launch.
	 * @param data - Optional data to pass.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	launchApp(
		app: string,
		className: string | null,
		data: string | null,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Opens a URL in an in-app browser.
	 * @param url - URL to open.
	 * @param title - Title for the browser window.
	 * @param showButtons - Whether to show navigation buttons.
	 * @param disableCache - Whether to disable caching.
	 * @returns In-app browser instance with event handlers.
	 */
	inAppBrowser(
		url: string,
		title: string,
		showButtons?: boolean,
		disableCache?: boolean,
	): SystemInAppBrowser;

	/**
	 * Sets the UI theme (status bar and navigation bar colors).
	 * @param systemBarColor - Color for system bars (hex string).
	 * @param theme - Theme mode ('light' or 'dark').
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	setUiTheme(
		systemBarColor: string,
		theme: "light" | "dark",
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Sets a handler for incoming intents.
	 * @param handler - Callback invoked when an intent is received.
	 * @param onerror - Error callback.
	 */
	setIntentHandler(
		handler: (intent: SystemIntent) => void,
		onerror: SystemErrorCallback,
	): void;

	/**
	 * Gets the intent that started the Cordova activity.
	 * @param success - Callback with intent data.
	 * @param error - Error callback.
	 */
	getCordovaIntent(
		success: SystemSuccessCallback<SystemIntent>,
		error: SystemErrorCallback,
	): void;

	/**
	 * Sets the input type for text fields.
	 * @param type - Input type string.
	 * @param success - Callback on success.
	 * @param error - Error callback.
	 */
	setInputType(
		type: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Gets a global Android setting value.
	 * @param key - Setting key to retrieve.
	 * @param success - Callback with setting value.
	 * @param error - Error callback.
	 */
	getGlobalSetting(
		key: string,
		success: SystemSuccessCallback,
		error: SystemErrorCallback,
	): void;

	/**
	 * Compares file content with provided text in a background thread.
	 * @param fileUri - The URI of the file to read.
	 * @param encoding - The character encoding to use.
	 * @param currentText - The text to compare against.
	 * @returns Promise resolving to true if content differs, false if same.
	 */
	compareFileText(
		fileUri: string,
		encoding: string,
		currentText: string,
	): Promise<boolean>;

	/**
	 * Compares two text strings in a background thread.
	 * @param text1 - First text to compare.
	 * @param text2 - Second text to compare.
	 * @returns Promise resolving to true if texts differ, false if same.
	 */
	compareTexts(text1: string, text2: string): Promise<boolean>;
}

/**
 * Global System instance providing native Android functionality.
 */
declare const system: System;
