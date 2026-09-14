declare namespace Acode {
	interface Helpers {
		/** CSS class string for a file icon from the active icon pack. */
		getIconForFile(filename: string): string;

		/**
		 * CSS class string for a folder icon from the active icon pack.
		 * Available from versionCode 1012.
		 */
		getIconForFolder(
			name: string,
			options?: { expanded?: boolean; isRoot?: boolean },
		): string;

		sortDir(
			list: any[],
			fileBrowser: any,
			mode: "both" | "file" | "folder",
		): any[];

		errorMessage(err: Error, ...args: string[]): Promise<string>;

		error(err: Error, ...args: string[]): Promise<void>;

		uuid(): string;

		parseJSON(string: string): unknown;

		isDir(type: "dir" | "directory" | "folder"): boolean;

		isFile(type: "file" | "link"): boolean;

		getVirtualPath(url: string): string;

		updateUriOfAllActiveFiles(oldUrl: string, newUrl: string): void;

		toInternalUri(uri: string): Promise<string>;

		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		promisify(func: Function, ...args: unknown[]): Promise<unknown>;

		checkAPIStatus(): Promise<boolean>;

		fixFilename(name: string): string;

		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		debounce(func: Function, wait: number): Function;

		defineDeprecatedProperty<T, V>(
			obj: T,
			name: PropertyKey,
			getter: () => V,
			setter: (value: V) => void,
		): void;

		parseHTML(html: string): Element | Element[];

		createFileStructure(
			uri: string,
			pathString: string,
			isFile?: boolean,
		): Promise<{
			uri: string;
			type: string;
		}>;

		formatDownloadCount(downloads: number): unknown;

		isBinary(file: string): boolean;
	}
}
