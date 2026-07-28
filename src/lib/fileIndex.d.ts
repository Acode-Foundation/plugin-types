declare namespace Acode {
	/**
	 * Flat metadata for a file or folder stored in the native workspace index.
	 * Available from versionCode 1002.
	 */
	interface FileIndexEntry {
		rootUrl: string;
		/** Alias of `parentUrl`. */
		parent: string;
		parentUrl: string;
		name: string;
		/** Path relative to the workspace root title/name. */
		path: string;
		url: string;
		/** Alias of `url`. */
		uri: string;
		mime?: string | null;
		/** Alias of `mime`. */
		type?: string | null;
		isDirectory: boolean;
		isFile: boolean;
		size: number;
		modifiedDate: number;
	}

	interface FileIndexQueryOptions {
		/** Restrict results to these workspace roots. Empty means all indexed roots. */
		roots?: string[];
		/** Case-insensitive substring match against name and path. */
		text?: string;
		/** Exact URL lookup. */
		url?: string;
		/** Include directories in results. Defaults to `false`. */
		includeDirectories?: boolean;
		/** Page size (1–1000). Defaults to `200`. */
		limit?: number;
		/** Pagination offset from a previous `cursor`. Defaults to `0`. */
		cursor?: number;
	}

	interface FileIndexQueryResult {
		entries: FileIndexEntry[];
		/** Next page offset, or `null` when there are no more results. */
		cursor: number | null;
		hasMore: boolean;
	}

	interface FileIndexScanOptions {
		title?: string;
		name?: string;
		excludeFolders?: string[];
		showHiddenFiles?: boolean;
		defaultEncoding?: string;
		/**
		 * When true, also cache file contents for faster search.
		 * Defaults to `false`.
		 */
		indexContent?: boolean;
	}

	interface FileIndexUpdateAdded {
		url: string;
		parentUrl: string;
	}

	interface FileIndexUpdateChanges {
		title?: string;
		name?: string;
		added?: FileIndexUpdateAdded[];
		removed?: string[];
		excludeFolders?: string[];
		showHiddenFiles?: boolean;
		defaultEncoding?: string;
	}

	interface FileIndexUpdateResult {
		added: number;
		removed: number;
	}

	interface FileIndexSearchMatchOptions {
		regExp?: boolean;
		wholeWord?: boolean;
		caseSensitive?: boolean;
		/** Comma/newline separated glob patterns. Defaults to all files. */
		include?: string;
		/** Comma/newline separated glob patterns to skip. */
		exclude?: string;
	}

	interface FileIndexSearchOptions {
		id?: string;
		mode?: "search" | "replace";
		/** Native roots to search via the index. */
		roots?: string[];
		/** Explicit file list (used with non-root searches / fallbacks). */
		files?: Array<Partial<FileIndexEntry> | FileIndexEntry>;
		search?: string;
		replace?: string;
		options?: FileIndexSearchMatchOptions;
		/** In-memory file contents keyed by URL (e.g. open dirty editors). */
		overlays?: Record<string, string>;
		/**
		 * Emit batched `search-results` events instead of one event per file.
		 * Defaults to `true` on the high-level `fileIndex.search` API.
		 */
		batchResults?: boolean;
		defaultEncoding?: string;
		/** Prefer cached file contents from the native index when available. */
		useIndex?: boolean;
	}

	interface FileIndexSearchMatch {
		match: string;
		renderText: string;
		line: string;
		position: {
			start: { line: number; column: number };
			end: { line: number; column: number };
		};
	}

	interface FileIndexSearchResultData {
		file: FileIndexEntry | Record<string, unknown>;
		matches: FileIndexSearchMatch[];
		limited?: boolean;
		text?: string;
	}

	type FileIndexEvent =
		| {
				id: string;
				type: "status";
				action?: "status";
				state: string;
				message: string;
				progress: number;
		  }
		| {
				id: string;
				type: "batch";
				action?: "batch";
				entries: FileIndexEntry[];
		  }
		| {
				id: string;
				type: "search-result";
				action?: "search-result";
				data: FileIndexSearchResultData;
		  }
		| {
				id: string;
				type: "search-results";
				action?: "search-results";
				data: FileIndexSearchResultData[];
		  }
		| {
				id: string;
				type: "replace-result";
				action?: "replace-result";
				file: FileIndexEntry | Record<string, unknown>;
				text: string;
		  }
		| {
				id: string;
				type: "progress";
				action?: "progress";
				data: number;
		  }
		| {
				id: string;
				type:
					| "done"
					| "cancelled"
					| "done-searching"
					| "done-replacing"
					| "error";
				action?: string;
				files?: number;
				dirs?: number;
				indexed?: number;
				error?: string;
				[key: string]: unknown;
		  };

	interface FileIndexCancellablePromise<T> extends Promise<T> {
		id: string;
		cancel: () => Promise<unknown>;
	}

	interface FileIndexSearchHandle {
		id: string;
		result: Promise<FileIndexEvent>;
		cancel: () => Promise<unknown>;
	}

	/**
	 * Asynchronous native workspace index for SAF (`content:`) and `file://` roots.
	 *
	 * Prefer this over the deprecated `fileList` API for filename queries and
	 * project-wide search on large local workspaces.
	 *
	 * Available from versionCode 1002.
	 */
	interface FileIndex {
		/**
		 * Whether the URL can be indexed natively (SAF / `file://`).
		 * FTP, SFTP, and custom storage providers return `false`.
		 */
		supports(url?: string): boolean;

		/**
		 * Scan a SAF or `file://` workspace into the native SQLite index.
		 * The returned promise also exposes `id` and `cancel()`.
		 */
		scan(
			root: string | { url: string; name?: string; title?: string },
			options?: FileIndexScanOptions,
		): FileIndexCancellablePromise<FileIndexEvent>;

		/**
		 * Incrementally refresh changed files or directory subtrees.
		 */
		update(
			root: string | { url: string; name?: string; title?: string },
			changes?: FileIndexUpdateChanges,
		): Promise<FileIndexUpdateResult>;

		/**
		 * Query indexed entries. Results are flat metadata records with cursor pagination.
		 */
		query(options?: FileIndexQueryOptions): Promise<FileIndexQueryResult>;

		/**
		 * Start a native streaming search or replace.
		 * Defaults `batchResults` to `true`.
		 */
		search(
			options: FileIndexSearchOptions,
			onEvent?: (event: FileIndexEvent) => void,
		): FileIndexSearchHandle;

		/** Get one indexed entry by exact URL. */
		get(url: string): Promise<FileIndexEntry | null>;

		/** Mark cached contents stale after an editor or filesystem change. */
		markDirty(urls: string[]): Promise<"OK" | unknown>;

		/** Remove one or more native workspace indexes. */
		clear(roots?: string[]): Promise<"OK" | unknown>;

		/**
		 * Wait until pending scans finish.
		 * When `roots` is omitted, waits for all in-flight scans.
		 */
		whenReady(roots?: string[]): Promise<PromiseSettledResult<unknown>[]>;

		/** Subscribe to scan / index events. Returns an unsubscribe function. */
		subscribe(listener: (event: FileIndexEvent) => void): () => boolean;

		/** Cancel a scan or search job by id. */
		cancel(id: string): Promise<unknown>;
	}
}
