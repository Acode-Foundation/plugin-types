declare namespace Acode {
	type CodeHighlightRoot =
		| Document
		| ShadowRoot
		| ParentNode
		| Element
		| null
		| undefined;

	/**
	 * Static CodeMirror / Lezer highlighter used by Acode for markdown
	 * previews, plugin pages, and LSP reference snippets.
	 *
	 * Token CSS does not pierce Shadow DOM. Custom editor tabs opt in
	 * with `highlightStyles: true`, or call `applyStyles` on the root.
	 * Available from versionCode 1008.
	 */
	interface CodeHighlight {
		/**
		 * Highlight a single line. Language is inferred from `uri`.
		 * When `symbolName` is set, matching text is wrapped in
		 * `<span class="symbol-match">`.
		 */
		highlightLine(
			text: string,
			uri: string,
			symbolName?: string | null,
		): Promise<string>;

		/**
		 * Highlight a code block. `language` is a mode name or markdown
		 * fence id (`"javascript"`, `"python"`, `"js"`, …).
		 * Returns escaped HTML with `tok-*` spans.
		 */
		highlightCodeBlock(code: string, language?: string | null): Promise<string>;

		/** Alias of {@link highlightCodeBlock}. */
		highlight(code: string, language?: string | null): Promise<string>;

		/** Drop cached highlight results. */
		clearCache(): void;

		/**
		 * Attach current-theme highlight CSS to a document or shadow root.
		 * Host elements resolve to their `shadowRoot` when present.
		 * Prefers `adoptedStyleSheets` so later theme changes update in place.
		 */
		applyStyles(
			root?: CodeHighlightRoot,
		): CSSStyleSheet | HTMLStyleElement | null;

		/** Token CSS for the current editor theme. */
		getStyles(): string;

		/**
		 * Shared constructed stylesheet, or `null` when the environment
		 * does not support `CSSStyleSheet.replaceSync`.
		 */
		getStyleSheet(): CSSStyleSheet | null;

		/** Wrapper class that receives background + token colors. */
		readonly HIGHLIGHT_CLASS: "cm-highlighted";
	}
}
