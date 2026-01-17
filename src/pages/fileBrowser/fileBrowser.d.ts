type BrowseMode = "file" | "folder" | "both";

interface SelectedFile {
	type: "file" | "folder";
	url: string;
	name: string;
}

interface DefaultDir {
	name: string;
	url: string;
}

interface FileBrowser {
	/**
	 * Opens the file browser.
	 * @param mode Specify file browser mode
	 * @param info A small message to show what the file browser is opened for
	 * @param doesOpenLast Should file browser open lastly visited directory?
	 * @param defaultDir Default directory to open
	 * @returns Selected file or folder information
	 */
	(
		mode?: BrowseMode,
		info?: string,
		doesOpenLast?: boolean,
		...defaultDir: DefaultDir[]
	): Promise<SelectedFile>;

	/**
	 * Opens the selected file in the editor.
	 * @param res The selected file result from file browser
	 */
	openFile(res: SelectedFile & { mode?: string }): void;

	/**
	 * Handles file open errors.
	 * @param err Error object with optional code property
	 */
	openFileError(err: { code?: number }): void;

	/**
	 * Opens the selected folder.
	 * @param res The selected folder result from file browser
	 */
	openFolder(res: SelectedFile): Promise<void>;

	/**
	 * Handles folder open errors.
	 * @param err Error object with optional code property
	 */
	openFolderError(err: { code?: number }): void;

	/**
	 * Opens the selected file or folder based on its type.
	 * @param res The selected result from file browser
	 */
	open(res: SelectedFile): void;

	/**
	 * Handles open errors (delegates to openFileError).
	 * @param err Error object with optional code property
	 */
	openError(err: { code?: number }): void;
}
