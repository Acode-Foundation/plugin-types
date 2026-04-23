/// <reference path="./ace/index.d.ts" />
/// <reference path="./components/index.d.ts" />
/// <reference path="./dialogs/index.d.ts" />
/// <reference path="./handlers/index.d.ts" />
/// <reference path="./lib/index.d.ts" />
/// <reference path="./pages/fileBrowser/index.d.ts" />
/// <reference path="./theme/index.d.ts" />
/// <reference path="./utils/index.d.ts" />
/// <reference path="./fileSystem.d.ts" />
/// <reference path="./sideBarApps.d.ts" />

declare namespace Acode {
	interface PluginInit {
		(
			baseUrl: string,
			$page: WCPage,
			options: PluginInitOptions,
		): void | Promise<void>;
	}

	interface PluginInitOptions {
		cacheFileUrl: string;
		cacheFile: FileSystem;
		firstInit: boolean;
	}

	type PluginSettingSelectOption =
		| string
		| readonly [value: string, label: string];

	interface PluginSettingPromptOption {
		match: RegExp;
		required: boolean;
		placeholder: string;
		test: (value: unknown) => boolean;
	}

	interface PluginSetting {
		key: string;
		text: string;
		icon?: string;
		iconColor?: string;
		info?: string;
		value?: unknown;
		valueText?: (value: unknown) => string;
		checkbox?: boolean;
		select?: readonly PluginSettingSelectOption[];
		prompt?: string;
		promptType?: string;
		promptOptions?: readonly PluginSettingPromptOption[];
	}

	interface PluginSettings {
		list: PluginSetting[];
		cb: (key: string, value: unknown) => void;
	}

	type Require = <K extends keyof Modules | (string & {})>(
		moduleName: K,
	) => Lowercase<K> extends keyof Modules ? Modules[Lowercase<K>] : unknown;

	interface FormatterRegistration {
		id: string;
		name: string;
		exts: string[];
	}

	interface Modules {
		acemodes: AceModes;
		actionstack: ActionStack;
		addedfolder: AddedFolder;
		alert: Alert;
		color: Color;
		colorpicker: ColorPicker;
		commands: Commands;
		confirm: Confirm;
		contextmenu: ContextMenuConstructor;
		createkeyboardevent: CreateKeyboardEvent;
		dialogbox: DialogBoxConstructor;
		editorfile: typeof EditorFile;
		editorlanguages: EditorLanguages;
		editorthemes: EditorThemes;
		encodings: Encodings;
		filebrowser: FileBrowser;
		filelist: FileList;
		fonts: Fonts;
		fs: FS;
		fsoperation: FS;
		helpers: Helpers;
		inputhints: InputHints;
		intent: Intent;
		keyboard: Keyboard;
		loader: Loader;
		multiprompt: MultiPrompt;
		openfolder: OpenFolder;
		page: Page;
		palette: Palette;
		projects: Projects;
		prompt: Prompt;
		select: Select;
		selectionmenu: SelectionMenu;
		settings: Settings;
		sidebarapps: SidebarApps;
		sidebutton: SideButtonConstructor;
		terminal: Acode.Terminal;
		themebuilder: typeof ThemeBuilder;
		themes: Themes;
		tointernalurl: Helpers["toInternalUri"];
		toast: Toast;
		tutorial: Tutorial;
		url: Url;
		windowresize: WindowResize;
	}

	interface AddIconOptions {
		monochrome?: boolean;
	}

	interface NotificationOptions {
		icon?: string;
		autoClose?: boolean;
		action?: () => void;
		type?: "info" | "warning" | "error" | "success";
	}

	interface FileHandlerFileInfo {
		name: string;
		uri: string;
		extension: string;
		[key: string]: unknown;
	}

	interface FileHandlerOptions {
		extensions: string[];
		handleFile: (fileInfo: FileHandlerFileInfo) => MaybePromise<void>;
	}
}

interface Acode {
	setPluginInit(
		pluginId: string,
		init: Acode.PluginInit,
		settings?: Acode.PluginSettings,
	): void;

	setPluginUnmount(id: string, unmount: () => void): void;

	initPlugin(
		id: string,
		baseUrl: string,
		$page: Acode.WCPage,
		options?: Acode.PluginInitOptions,
	): Promise<void>;

	unmountPlugin(id: string): void;

	define(moduleName: string, module: unknown): void;

	require: Acode.Require;

	exec(command: string, value?: unknown): boolean | undefined;

	registerFormatter(
		pluginId: string,
		extensions: string[],
		format: () => Acode.MaybePromise<void>,
		displayName?: string,
	): void;

	unregisterFormatter(pluginId: string): void;

	format(selectIfNull?: boolean): Promise<boolean>;

	get formatters(): Acode.FormatterRegistration[];

	getFormatterFor(extensions: string[]): [id: string | null, name: string][];

	addIcon(
		iconName: string,
		iconSrc: string,
		options?: Acode.AddIconOptions,
	): void;

	toInternalUrl(url: string): Promise<string>;

	pushNotification(
		title: string,
		message: string,
		options?: Acode.NotificationOptions,
	): void;

	installPlugin(pluginId: string, installerPluginName: string): Promise<void>;

	newEditorFile(
		filename: string,
		options?: Acode.FileOptions,
	): Acode.EditorFile;

	addCommand(descriptor: Acode.CommandDescriptor): void;

	removeCommand(name: string): void;

	execCommand(
		name: string,
		view?: Ace.Editor & Acode.EditorLike,
		args?: unknown,
	): Acode.MaybePromise<boolean | undefined>;

	listCommands(): Acode.CommandDescriptor[];

	joinUrl: Acode.Url["join"];
	alert: Acode.Alert;
	confirm: Acode.Confirm;
	select: Acode.Select;
	multiPrompt: Acode.MultiPrompt;
	loader: Acode.Loader;
	prompt: Acode.Prompt;
	fsOperation: Acode.FS;
	fileBrowser: FileBrowser;

	get exitAppMessage(): string | undefined;

	setLoadingMessage(message: string): void;

	waitForPlugin(pluginId: string): Promise<boolean>;

	clearBrokenPluginMark(pluginId: string): void;

	registerFileHandler(id: string, options: Acode.FileHandlerOptions): void;

	unregisterFileHandler(id: string): void;
}

declare const acode: Acode;

declare const ASSETS_DIRECTORY: string;

declare const CACHE_STORAGE: string;

declare const DATA_STORAGE: string;

declare const PLUGIN_DIR: string;

declare const DOES_SUPPORT_THEME: boolean;

declare const IS_FREE_VERSION: boolean;

declare const KEYBINDING_FILE: string;

declare const ANDROID_SDK_INT: number;

declare function log(
	level: "error" | "warn" | "info" | "debug",
	message: unknown,
): void;

declare const ace: Ace;

interface Window {
	acode: Acode;
	ASSETS_DIRECTORY: string;
	CACHE_STORAGE: string;
	DATA_STORAGE: string;
	PLUGIN_DIR: string;
	DOES_SUPPORT_THEME: boolean;
	IS_FREE_VERSION: boolean;
	KEYBINDING_FILE: string;
	ANDROID_SDK_INT: number;
	tag: typeof tag;
	log: typeof log;
	ace: Ace;
}
