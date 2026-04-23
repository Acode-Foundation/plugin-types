import type { Extension } from "@codemirror/state";

declare global {
	namespace Acode {
		type EditorLanguageLoader = () => MaybePromise<
			Extension | readonly Extension[]
		>;

		interface EditorLanguages {
			register(
				name: string,
				extensions: string | readonly string[],
				caption?: string,
				loader?: EditorLanguageLoader,
			): void;
			unregister(name: string): void;
			add(
				name: string,
				extensions: string | readonly string[],
				caption?: string,
				loader?: EditorLanguageLoader,
			): void;
			remove(name: string): void;
			list(): string[];
			listByName(): Record<string, string>;
			get(name: string): Extension | readonly Extension[] | undefined;
		}
	}
}
