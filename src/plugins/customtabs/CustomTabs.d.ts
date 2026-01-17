/**
 * Options for opening a URL in Chrome Custom Tabs.
 */
interface CustomTabsOptions {
	/**
	 * The toolbar color for the Custom Tab.
	 * Accepts any valid CSS color string (e.g., '#FF5733', 'rgb(255,87,51)', 'red').
	 */
	toolbarColor?: string;

	/**
	 * Whether to show the page title in the toolbar.
	 * @default true
	 */
	showTitle?: boolean;
}

/**
 * Chrome Custom Tabs plugin for Cordova.
 * Opens URLs in a Chrome Custom Tab, providing a seamless in-app browsing experience
 * with faster loading times compared to launching the default browser.
 * Falls back to the default browser if Custom Tabs are not available.
 */
interface CustomTabs {
	/**
	 * Opens a URL in a Chrome Custom Tab.
	 *
	 * @param url - The URL to open.
	 * @param options - Optional configuration for the Custom Tab appearance.
	 * @param success - Callback called when the Custom Tab is successfully launched.
	 * @param error - Callback called if an error occurs while opening the URL.
	 *
	 * @example
	 * // Open a URL with default options
	 * CustomTabs.open('https://example.com');
	 *
	 * @example
	 * // Open with custom toolbar color
	 * CustomTabs.open(
	 *   'https://example.com',
	 *   { toolbarColor: '#6200EE', showTitle: true },
	 *   () => console.log('Opened successfully'),
	 *   (err) => console.error('Failed to open:', err)
	 * );
	 */
	open(
		url: string,
		options?: CustomTabsOptions,
		success?: () => void,
		error?: (message: string) => void,
	): void;
}

/**
 * Global CustomTabs instance for opening URLs in Chrome Custom Tabs.
 */
declare const CustomTabs: CustomTabs;
