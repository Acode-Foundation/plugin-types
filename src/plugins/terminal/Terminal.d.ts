/**
 * Logger function type for terminal operations.
 */
type TerminalLogger = (message: string, ...args: unknown[]) => void;

/**
 * Terminal module providing Alpine Linux sandbox management for Acode.
 * Handles installation, lifecycle management, backup/restore, and process control
 * for the AXS environment.
 */
interface Terminal {
	/**
	 * Starts the AXS environment by writing init scripts and executing the sandbox.
	 *
	 * @param installing - Whether AXS is being started during installation
	 * @param logger - Function to log standard output
	 * @param err_logger - Function to log errors
	 * @returns Promise resolving to `true` if installation completes with exit code 0, or `undefined` if not installing
	 */
	startAxs(
		installing?: boolean,
		logger?: TerminalLogger,
		err_logger?: TerminalLogger,
	): Promise<boolean | undefined>;

	/**
	 * Stops the AXS process by forcefully killing it.
	 *
	 * @returns Promise resolving when the process is stopped
	 */
	stopAxs(): Promise<void>;

	/**
	 * Checks if the AXS process is currently running.
	 *
	 * @returns Promise resolving to `true` if AXS is running, `false` otherwise
	 */
	isAxsRunning(): Promise<boolean>;

	/**
	 * Installs Alpine by downloading binaries and extracting the root filesystem.
	 * Also sets up additional dependencies for F-Droid variant.
	 *
	 * @param logger - Function to log standard output
	 * @param err_logger - Function to log errors
	 * @returns Promise resolving to `true` if installation completes with exit code 0, `false` otherwise
	 */
	install(
		logger?: TerminalLogger,
		err_logger?: TerminalLogger,
	): Promise<boolean>;

	/**
	 * Checks if Alpine is already installed.
	 *
	 * @returns Promise resolving to `true` if all required files and directories exist
	 */
	isInstalled(): Promise<boolean>;

	/**
	 * Checks if the current device architecture is supported.
	 *
	 * @returns Promise resolving to `true` if architecture is supported (`arm64-v8a`, `armeabi-v7a`, or `x86_64`), otherwise `false`
	 */
	isSupported(): Promise<boolean>;

	/**
	 * Creates a backup of the Alpine Linux installation.
	 * Creates a compressed tar archive of the Alpine installation.
	 *
	 * @returns Promise resolving to the file URI of the created backup file (`aterm_backup.tar`)
	 * @throws Rejects with "Alpine is not installed." if Alpine is not currently installed
	 * @throws Rejects with command output if backup creation fails
	 *
	 * @example
	 * try {
	 *   const backupPath = await Terminal.backup();
	 *   console.log(`Backup created at: ${backupPath}`);
	 * } catch (error) {
	 *   console.error(`Backup failed: ${error}`);
	 * }
	 */
	backup(): Promise<string>;

	/**
	 * Restores Alpine Linux installation from a backup file.
	 * Restores the Alpine installation from a previously created backup file (`aterm_backup.tar`).
	 * This function stops any running Alpine processes, removes existing installation files,
	 * and extracts the backup to restore the previous state.
	 *
	 * @returns Promise resolving to "ok" when restoration completes successfully
	 * @throws Rejects with "Backup File does not exist" if `aterm_backup.tar` is not found
	 * @throws Rejects with command output if restoration fails
	 *
	 * @example
	 * try {
	 *   await Terminal.restore();
	 *   console.log("Alpine installation restored successfully");
	 * } catch (error) {
	 *   console.error(`Restore failed: ${error}`);
	 * }
	 */
	restore(): Promise<string>;

	/**
	 * Uninstalls the Alpine Linux installation.
	 * Completely removes the Alpine Linux installation from the device by deleting all
	 * Alpine-related files and directories. This function stops any running Alpine processes
	 * before removal.
	 *
	 * @returns Promise resolving to "ok" when uninstallation completes successfully
	 * @throws Rejects with command output if uninstallation fails
	 *
	 * @example
	 * try {
	 *   await Terminal.uninstall();
	 *   console.log("Alpine installation removed successfully");
	 * } catch (error) {
	 *   console.error(`Uninstall failed: ${error}`);
	 * }
	 */
	uninstall(): Promise<string>;
}
