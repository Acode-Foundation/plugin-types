declare namespace Acode {
	class EditorFile {
		hideQuickTools: boolean;

		stylesheets: string | string[];

		focusedBefore: boolean;

		focused: boolean;

		loaded: boolean;

		loading: boolean;

		deletedFile: boolean;

		session: Ace.EditSession;

		encoding: string;

		readOnly: boolean;

		markChanged: boolean;

		onsave?: (event: FileEvent) => void;
		onchange?: (event: FileEvent) => void;
		onfocus?: (event: FileEvent) => void;
		onblur?: (event: FileEvent) => void;
		onclose?: (event: FileEvent) => void;
		onrename?: (event: FileEvent) => void;
		onload?: (event: FileEvent) => void;
		onloaderror?: (event: FileEvent) => void;
		onloadstart?: (event: FileEvent) => void;
		onloadend?: (event: FileEvent) => void;
		onchangemode?: (event: FileEvent) => void;
		onrun?: (event: FileEvent) => void;
		oncanrun?: (event: FileEvent) => void;
		/** Called when the tab pin state changes. */
		onpinstatechange?: (pinned: boolean) => void;

		constructor(name: string, options?: FileOptions);

		readonly type: string;

		readonly tabIcon: string;

		readonly content: HTMLElement;

		id: string;

		filename: string;

		location: string;

		uri: string;

		eol: "windows" | "unix";

		editable: boolean;

		/**
		 * Whether the tab is pinned. Pinned tabs cannot be closed until unpinned
		 * (unless {@link remove} is called with `ignorePinned: true`).
		 */
		pinned: boolean;

		isUnsaved: boolean;

		readonly name: string;

		readonly cacheFile: string;

		readonly icon: string;

		readonly tab: HTMLElement;

		readonly SAFMode: "single" | "tree" | undefined;

		/** Header subtitle used for the editor title bar (path/location). */
		readonly headerSubtitle: string;

		/** Target pane id when multi-pane layout is active. */
		paneId?: string | null;

		/** Temporary empty tab created for an empty editor pane. */
		isPanePlaceholder?: boolean;

		writeToCache(): Promise<void>;

		isChanged(): Promise<boolean>;

		canRun(): Promise<boolean>;

		readCanRun(): Promise<boolean>;

		writeCanRun(cb: () => boolean | Promise<boolean>): Promise<boolean>;

		/**
		 * Removes and closes the file.
		 * @param force Skip the unsaved confirmation when `true`.
		 * @param options.ignorePinned Close even if the tab is pinned.
		 * @param options.silentPinned Suppress the "unpin before closing" toast.
		 */
		remove(
			force?: boolean,
			options?: {
				ignorePinned?: boolean;
				silentPinned?: boolean;
				suppressPanePlaceholder?: boolean;
			},
		): Promise<boolean | undefined>;

		save(): Promise<boolean>;

		saveAs(): Promise<boolean>;

		/** Sets CodeMirror read-only state and updates editability. */
		setReadOnly(value: boolean): void;

		setMode(mode: string): void;

		/**
		 * Updates pin state.
		 * When `reorder` is true, pinned tabs are regrouped in the open file list.
		 * When `emit` is true, emits `editorManager` update `"pin-tab"`.
		 */
		setPinnedState(
			value: boolean,
			options?: { reorder?: boolean; emit?: boolean },
		): boolean;

		/** Toggles pin state. */
		togglePinned(): boolean;

		makeActive(): void;

		removeActive(): void;

		openWith(): void;

		editWith(): void;

		share(): void;

		runAction(): void;

		run(): void;

		runFile(): void;

		render(): void;

		on(event: FileEventType, callback: (event: FileEvent) => void): void;

		off(event: FileEventType, callback: (event: FileEvent) => void): void;

		addStyle(style: string): void;

		setCustomTitle(titleFn: () => void): void;
	}

	interface FileOptions {
		isUnsaved?: boolean;

		render?: boolean;

		id?: string;

		uri?: string;

		text?: string;

		editable?: boolean;

		/** When true, the file opens as read-only. */
		readOnly?: boolean;

		deletedFile?: boolean;

		SAFMode?: "single" | "tree";

		encoding?: string;

		cursorPos?: object;

		scrollLeft?: number;

		scrollTop?: number;

		folds?: Ace.Fold[];

		/** Pin the tab to prevent accidental closing. */
		pinned?: boolean;

		type?: string;

		tabIcon?: string;

		content?: string | HTMLElement;

		stylesheets?: string | string[];

		hideQuickTools?: boolean;

		/** Target editor pane id for multi-pane layouts. */
		paneId?: string;

		/** Target editor pane instance for multi-pane layouts. */
		pane?: EditorPane;

		/** Temporary empty tab for an empty pane. */
		isPanePlaceholder?: boolean;
	}

	interface FileEvent {
		target: EditorFile;
		stopPropagation(): void;
		preventDefault(): void;
		readonly BUBBLING_PHASE: boolean;
		readonly defaultPrevented: boolean;
	}

	type FileEventType =
		| "run"
		| "save"
		| "change"
		| "focus"
		| "blur"
		| "close"
		| "rename"
		| "load"
		| "loadError"
		| "loadStart"
		| "loadEnd"
		| "changeMode"
		| "changeEncoding"
		| "changeReadOnly";
}
