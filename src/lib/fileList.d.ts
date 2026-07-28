declare namespace Acode {
	/**
	 * @deprecated Prefer the asynchronous {@link FileIndex} API
	 * (`acode.require("fileIndex")`) for SAF and `file://` workspaces.
	 *
	 * From versionCode 1002, `fileList` only contains files from non-native
	 * providers (FTP, SFTP, custom storage). Native local workspaces live in
	 * the native SQLite index and are queried via `fileIndex`.
	 */
	interface FileList {
		(dir?: string | ((item: Tree) => unknown)): Tree[] | Tree | null;

		on(event: FileListEvent, callback: (tree: Tree | unknown) => void): void;

		off(event: FileListEvent, callback: (tree: Tree | unknown) => void): void;

		/** Set when accessed via `acode.require("fileList")`. */
		deprecated?: true;

		/** Set when accessed via `acode.require("fileList")`. */
		replacement?: "fileIndex";
	}

	interface Tree {
		name: string;

		url: string;

		path: string;

		children: Tree[] | null;

		parent: Tree | null;

		mime?: string | null;

		size?: number;

		modifiedDate?: number;

		readonly isConnected: boolean;

		readonly root: Tree;

		update(url: string, name?: string): void;

		toJSON(): TreeJson;
	}

	interface TreeJson {
		name: string;
		url: string;
		path: string;
		parent?: string;
		mime?: string | null;
		size?: number;
		modifiedDate?: number;
		isDirectory: boolean;
	}

	type FileListEvent =
		| "add-file"
		| "push-file"
		| "remove-file"
		| "add-folder"
		| "remove-folder"
		| "refresh";
}
