declare namespace Acode {
	type FileIconKind = "file" | "folder";

	/**
	 * An explicit icon definition uses exactly one of `src` or `className`.
	 */
	type FileIconDefinition =
		| { src: string; monochrome?: boolean; className?: never }
		| { className: string; src?: never; monochrome?: never };

	interface FileIconAssociations {
		/** Exact basenames mapped to icon IDs, such as `package.json`. */
		fileNames?: Record<string, string>;
		/** Extensions without leading dots, including compounds such as `test.ts`. */
		fileExtensions?: Record<string, string>;
		/** Acode CodeMirror mode names mapped to icon IDs. */
		languageIds?: Record<string, string>;
		/** Folder basenames mapped to closed icon IDs. */
		folderNames?: Record<string, string>;
		/** Folder basenames mapped to expanded icon IDs. */
		folderNamesExpanded?: Record<string, string>;
	}

	interface FileIconDefaults {
		/** Default file icon ID. Omitted: built-in file fallback. */
		file?: string;
		/** Default closed folder icon ID. Omitted: built-in folder fallback. */
		folder?: string;
		/** Expanded folder icon ID. Omitted: reuse `folder`. */
		folderExpanded?: string;
		/** Workspace-root icon ID. Omitted: reuse `folder`. */
		rootFolder?: string;
		/**
		 * Expanded root icon ID. Falls back through `rootFolder`,
		 * `folderExpanded`, then `folder`.
		 */
		rootFolderExpanded?: string;
	}

	/**
	 * Complete icon pack registered through
	 * `acode.require("fileIcons").register(...)`.
	 *
	 * Association maps and defaults live at the top level. Acode supplies
	 * pack ownership from the loading plugin.
	 *
	 * Available from versionCode 1012.
	 */
	interface FileIconPack extends FileIconAssociations, FileIconDefaults {
		/**
		 * Stable pack ID. Start with a letter; use letters, digits, `.`, `_`,
		 * or `-`. `builtin` is reserved.
		 */
		id: string;
		/** Display name. Defaults to `id`. */
		name?: string;
		/** Schema version. Defaults to `1`. Unsupported versions are rejected. */
		schemaVersion?: number;
		/**
		 * Optional compatibility field. If supplied, it must match the loading
		 * plugin; a mismatch throws. Acode supplies ownership internally.
		 */
		pluginId?: string;
		/**
		 * An absolute SVG directory URL, or a map of icon IDs to definitions.
		 * Directory shorthand IDs resolve to `{id}.svg` in that folder.
		 */
		icons?: string | Record<string, FileIconDefinition>;
	}

	/**
	 * Resource passed to `fileIcons.icon(...)`.
	 * A filename string is also accepted and treated as a file.
	 */
	interface FileIconResource {
		/** Basename or path. URI decoding is not performed. */
		name: string;
		/** Defaults to `"file"`. */
		kind?: FileIconKind;
		/**
		 * Optional known Acode mode name for a file; avoids language inference.
		 * Filename/extension associations still take precedence.
		 */
		languageId?: string;
		/** Folder expansion state. Defaults to `false`. */
		expanded?: boolean;
		/** Whether a folder is a workspace root. Defaults to `false`. */
		isRoot?: boolean;
	}

	interface FileIconRegistration {
		/** Remove this registration. Idempotent. */
		dispose(): void;
	}

	interface FileIconChangeInfo {
		activeId: string;
		preferredId: string;
	}

	/**
	 * Plugin-bound file and folder icon pack API.
	 *
	 * Only `register`, `icon`, and `onChange` are exported to plugins.
	 * Capture this API with `acode.require("fileIcons")` in the plugin main
	 * script, or take `fileIcons` from the plugin initialization options.
	 *
	 * Available from versionCode 1012.
	 */
	interface FileIcons {
		/**
		 * Validate and register a complete pack. Same ID and owner replaces
		 * the previous pack atomically. Does not select the pack.
		 */
		register(pack: FileIconPack): FileIconRegistration;

		/**
		 * CSS class string for the resource's current icon or fallback.
		 * Treat generated classes as opaque.
		 */
		icon(resource: FileIconResource | string): string;

		/**
		 * Subscribe to active/preferred pack changes, active pack
		 * replacement/removal, and asset readiness. Returns an idempotent
		 * unsubscribe function. Does not invoke the listener immediately.
		 */
		onChange(listener: (info: FileIconChangeInfo) => void): () => void;
	}
}
