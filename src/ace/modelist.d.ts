declare namespace Acode {
	interface AceModes {
		addMode(
			name: string,
			extensions: string | readonly string[],
			caption?: string,
			loader?: EditorLanguageLoader,
		): void;
		removeMode(name: string): void;
	}
}
