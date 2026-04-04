/**
 * TypeScript declarations for the `editorThemes` module.
 * This module provides an API for managing CodeMirror editor themes in Acode.
 */
import type { Extension } from "@codemirror/state";
import type { HighlightStyle } from "@codemirror/language";

declare global {
	namespace Acode {
		interface ThemeSpec {
			id: string;
			caption?: string;
			dark?: boolean;
			getExtension?: () => Extension | Extension[];
			extensions?: Extension | Extension[];
			extension?: Extension | Extension[];
			theme?: Extension | Extension[];
			config?: object;
		}

		interface HighlightStyleSpec {
			[key: string]: string | number | boolean;
		}

		interface EditorThemes {
			register(spec: ThemeSpec): boolean;
			unregister(id: string): void;
			list(): string[];
			apply(id: string): void;
			get(id: string): ThemeSpec | null;
			getConfig(id: string): object | null;
			createTheme(options: {
				styles?: Record<string, string | number | boolean>;
				dark?: boolean;
				highlightStyle?: HighlightStyleSpec | HighlightStyle;
				extensions?: Extension | Extension[];
			}): Extension[];
			createHighlightStyle(spec: HighlightStyleSpec | HighlightStyle): HighlightStyle | null;
			cm: {
				EditorView: typeof import("@codemirror/view").EditorView;
				HighlightStyle: typeof HighlightStyle;
				syntaxHighlighting: typeof import("@codemirror/language").syntaxHighlighting;
				tags: typeof import("@lezer/highlight").tags;
			};
		}
	}
}
