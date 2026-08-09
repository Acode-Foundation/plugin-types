declare namespace Acode {
	/**
	 * Opens the color picker dialog.
	 * Resolves with the selected color string (hex / rgb / hsl, with alpha when used).
	 * Rejects with `Error("cancelled")` when the user cancels or dismisses the dialog.
	 */
	interface ColorPicker {
		(defaultColor?: string, onhide?: () => void): Promise<string>;
	}
}
