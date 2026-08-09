declare namespace Acode {
	type PaneSplitDirection =
		| "horizontal"
		| "vertical"
		| "right"
		| "down"
		| "below";

	type PaneFocusDirection = "left" | "right" | "up" | "down";

	/**
	 * An editor split pane. Exposed on `editorManager.panes` / `activePane`.
	 * Plugins typically use the high-level split helpers rather than mutating
	 * pane internals directly.
	 */
	interface EditorPane {
		id: string;
		files: EditorFile[];
		activeFile: EditorFile | null;
		/** CodeMirror `EditorView` for this pane. */
		editor: (Ace.Editor & EditorLike) | null;
		editorContainer: HTMLElement;
		element: HTMLElement;
		tabList: HTMLElement;
		content: HTMLElement;
		[key: string]: unknown;
	}

	interface CreatePaneOptions {
		/**
		 * Split direction relative to `sourcePane`.
		 * `"horizontal"` / `"right"` open to the right;
		 * `"vertical"` / `"down"` / `"below"` open below.
		 * @default "horizontal"
		 */
		direction?: PaneSplitDirection;
		/** Pane to split from. Defaults to the active pane. */
		sourcePane?: EditorPane;
		/** Move this file into the new pane and activate it. */
		moveFile?: EditorFile;
		/**
		 * Create an untitled placeholder file in the new pane.
		 * Ignored when `moveFile` is set.
		 * @default true
		 */
		createUntitled?: boolean;
		/**
		 * Activate the new pane when no file is moved.
		 * @default true
		 */
		activate?: boolean;
	}

	interface MoveFileToPaneOptions {
		/** Activate the file after the move. @default true */
		activate?: boolean;
		/** Insert index within the target pane's file list. */
		index?: number | null;
		/** @default true */
		createSourcePlaceholder?: boolean;
		/** @default true */
		activateSourceFallback?: boolean;
	}

	interface SetActivePaneOptions {
		/** Emit switch-file update events. @default true */
		emitSwitch?: boolean;
	}

	interface EditorManager {
		files: EditorFile[];
		onupdate: (action?: string, ...args: unknown[]) => void;
		activeFile: EditorFile | null;
		/**
		 * Adds an already-constructed {@link EditorFile} to the workspace.
		 * Prefer `new EditorFile(...)` or `acode.newEditorFile(...)` for new tabs.
		 */
		addFile(file: EditorFile): void;
		/**
		 * Active CodeMirror `EditorView` (with Ace-compat helpers for legacy plugins).
		 */
		editor: Ace.Editor & EditorLike;
		/** Always `true` on modern Acode builds that ship CodeMirror. */
		isCodeMirror: boolean;
		getFile(
			test: string,
			type: "uri" | "id" | "name" | "git" | "gist",
		): EditorFile | null | undefined;
		switchFile(id: string): void;
		hasUnsavedFiles(): number;
		getEditorHeight(editor: Ace.Editor & EditorLike): number;
		getEditorWidth(editor: Ace.Editor & EditorLike): number;
		/**
		 * Active pane's editor container. Prefer this over assuming a single
		 * global editor DOM node when multi-pane layout is active.
		 */
		container: HTMLElement;
		header: HTMLElement & { text?: string; subText?: string };
		readonly isScrolling: boolean;
		readonly TIMEOUT_VALUE: number;
		readonly openFileList: HTMLElement;

		// --- Multi-pane layout (v1.12.7+) ---

		/** Currently focused editor pane. */
		readonly activePane: EditorPane | null | undefined;
		/** Snapshot of all open editor panes. */
		readonly panes: EditorPane[];
		/** Tab list element for the active pane. */
		readonly activePaneTabList: HTMLElement | null | undefined;

		/**
		 * Create a new editor pane (split).
		 * Returns `null` when there is not enough space.
		 */
		createPane(options?: CreatePaneOptions): Promise<EditorPane | null>;
		/** Split the active pane in the given direction. */
		splitPane(direction?: PaneSplitDirection): Promise<EditorPane | null>;
		/** Split to the right of the active pane. */
		splitPaneRight(): Promise<EditorPane | null>;
		/** Split below the active pane. */
		splitPaneDown(): Promise<EditorPane | null>;
		/** Close the active pane (moves remaining files to a neighbor). */
		closeActivePane(): boolean;
		/** Close `pane` when it has no files left. */
		closeEmptyPane(pane?: EditorPane): boolean;
		/** Focus the next pane in layout order. */
		focusNextPane(): boolean;
		/** Focus the previous pane in layout order. */
		focusPreviousPane(): boolean;
		/** Focus a neighboring pane by screen direction. */
		focusPaneByDirection(direction: PaneFocusDirection): boolean;
		/** Move the active file into a newly created pane. */
		moveActiveFileToNewPane(
			direction?: PaneSplitDirection,
		): Promise<EditorPane | null>;
		/** Move a file into another pane. */
		moveFileToPane(
			file: EditorFile,
			targetPane: EditorPane,
			options?: MoveFileToPaneOptions,
		): boolean;
		/** Remove a file from its pane without closing the tab globally. */
		removeFileFromPane(file: EditorFile): void;
		/** Reorder open tabs so pinned files stay grouped at the front. */
		moveFileByPinnedState(file: EditorFile): void;
		normalizePinnedTabOrder(pane?: EditorPane): void;
		/** Resolve the pane that currently hosts `file`. */
		getFilePane(fileOrId: EditorFile | string): EditorPane | null;
		/** Files belonging to a pane (or the active pane). */
		getPaneFiles(fileOrPane?: EditorFile | EditorPane): EditorFile[];
		/** Tab list element for a pane (or the active pane). */
		getPaneTabList(
			fileOrPane?: EditorFile | EditorPane,
		): HTMLElement | null | undefined;
		setActivePane(
			pane: EditorPane,
			options?: SetActivePaneOptions,
		): EditorPane | null | undefined;
		reapplyActiveFile(): void;
		syncOpenFileList(): void;

		// --- Tab history ---

		openPreviousEditorFromHistory(): boolean | undefined;
		openNextEditorFromHistory(): boolean | undefined;
		recordHistory(file?: EditorFile): void;
		readonly editorHistory: unknown[];
		readonly editorHistoryIndex: number;

		// --- LSP / cache helpers ---

		/** Restart LSP clients for the active editor file. */
		restartLsp(): void;
		/** Flush pending crash-cache writes for open editor files. */
		flushCacheWrites(): Promise<unknown[]>;

		getLspMetadata?: (file?: EditorFile) => unknown;

		on(
			event:
				| "file-content-changed"
				| "file-loaded"
				| "remove-file"
				| "save-file"
				| "switch-file"
				| "update",
			listener: (file: EditorFile) => void,
		): void;
		on(
			event: "add-folder" | "remove-folder" | "update-folder",
			listener: (ev: { url: string; name: string }) => void,
		): void;
		/**
		 * `update` listeners may receive a sub-action as the first argument
		 * (e.g. `"pin-tab"`, `"switch-file"`, `"read-only"`) and optional extras.
		 */
		on(event: EditorEvent, listener: (...args: any[]) => void): void;
		off(event: string, listener: (...args: any[]) => void): void;
		emit(event: EditorEvent, ...args: any[]): void;
	}

	type EditorEvent =
		| "add-folder"
		| "change"
		| "file-content-changed"
		| "file-loaded"
		| "init-open-file-list"
		| "new-file"
		| "remove-file"
		| "remove-folder"
		| "rename-file"
		| "save-file"
		| "switch-file"
		| "update"
		| "update-folder";
}

declare const editorManager: Acode.EditorManager;

interface Window {
	editorManager: Acode.EditorManager;
}
