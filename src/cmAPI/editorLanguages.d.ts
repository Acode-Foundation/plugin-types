import type { Extension } from "@codemirror/state";

declare global {
	namespace Acode {
		/**
		 * Preferred **CodeMirror** language registration API for plugins
		 */
		interface EditorLanguages {
			/**
			 * Registers a new language mode with CodeMirror.
			 * @param name Internal Mode Name
			 * @param extensions File extensions to associate with the mode (without `.`)
			 * @param [caption] Display name for the mode (shown in UI)
			 * @param [loader] Function returning a CodeMirror extension (or a Promise resolving to one).
			 * @returns
			 */
			register: (name: string, extensions: string | string[], caption?: string, loader?: () => Extension | Promise<Extension>) => void;

			/**
			 *
			 * @param name
			 * @returns
			 */
			unregister: (name: string) => void;
			
			/**
			 * Adds a new language mode with CodeMirror.
			 * @param name Internal Mode Name
			 * @param extensions File extensions to associate with the mode (without `.`)
			 * @param [caption] Display name for the mode (shown in UI)
			 * @param [loader] Function returning a CodeMirror extension (or a Promise resolving to one).
			 * @returns
			 */
			add: (name: string, extensions: string | string[], caption?: string, loader?: () => Extension | Promise<Extension>) => void;
			
			/**
			 * Removes a language mode from CodeMirror.
			 * @param name Internal Mode Name
			 * @returns
			 */
			remove: (name: string) => void;
			
			/**
			 * Lists all registered language modes.
			 * @returns Array of internal mode names
			 */
			list: () => string[];

			/**
			 * Lists all registered language modes with their display names.
			 * @returns Record of internal mode names to display names
			 */
			listByName: () => Record<string, string>;

			/**
			 * Gets the CodeMirror extension for a language mode.
			 * @param name Internal Mode Name
			 * @returns The extension, or `undefined` if not found
			 */
			get: (name: string) => Extension | undefined;

		}
	}
}

export {};

export {};
