/**
 * Type of output received from a running process.
 * - `stdout`: Standard output line
 * - `stderr`: Standard error line
 * - `exit`: Exit code of the process
 * - `unknown`: Unrecognized output format
 */
type ExecutorOutputType = "stdout" | "stderr" | "exit" | "unknown";

/**
 * Callback function for receiving real-time process output.
 * @param type - The type of output
 * @param data - The output data (line content or exit code)
 */
type ExecutorOutputCallback = (type: ExecutorOutputType, data: string) => void;

/**
 * Provides an interface to run shell commands from a Cordova app.
 * Supports real-time process streaming, writing input to running processes,
 * stopping them, and executing one-time commands.
 */
interface Executor {
	/**
	 * The type of executor: "Executor" for foreground or "BackgroundExecutor" for background.
	 */
	readonly ExecutorType: "Executor" | "BackgroundExecutor";

	/**
	 * A background executor instance for running processes in the background.
	 * Only available on the main Executor instance exported from the module.
	 */
	BackgroundExecutor: Executor;

	/**
	 * Starts a shell process and enables real-time streaming of stdout, stderr, and exit status.
	 *
	 * @param command - The shell command to run (e.g., `"sh"`, `"ls -al"`)
	 * @param onData - Callback that receives real-time output:
	 *   - `"stdout"`: Standard output line
	 *   - `"stderr"`: Standard error line
	 *   - `"exit"`: Exit code of the process
	 * @param alpine - Whether to run the command inside the Alpine sandbox environment (`true`) or on Android directly (`false`)
	 * @returns Promise resolving with a unique process ID (UUID) used for future references like `write()` or `stop()`
	 *
	 * @example
	 * Executor.start('sh', (type, data) => {
	 *   console.log(`[${type}] ${data}`);
	 * }).then(uuid => {
	 *   Executor.write(uuid, 'echo Hello World');
	 *   Executor.stop(uuid);
	 * });
	 */
	start(
		command: string,
		onData: ExecutorOutputCallback,
		alpine?: boolean,
	): Promise<string>;

	/**
	 * Sends input to a running process's stdin.
	 *
	 * @param uuid - The process ID returned by {@link Executor.start}
	 * @param input - Input string to send (e.g., shell commands)
	 * @returns Promise resolving once the input is written
	 *
	 * @example
	 * Executor.write(uuid, 'ls /sdcard');
	 */
	write(uuid: string, input: string): Promise<string>;

	/**
	 * Moves the executor service to the background (stops foreground notification).
	 *
	 * @returns Promise resolving when the service is moved to background
	 *
	 * @example
	 * Executor.moveToBackground();
	 */
	moveToBackground(): Promise<string>;

	/**
	 * Moves the executor service to the foreground (shows notification).
	 *
	 * @returns Promise resolving when the service is moved to foreground
	 *
	 * @example
	 * Executor.moveToForeground();
	 */
	moveToForeground(): Promise<string>;

	/**
	 * Terminates a running process.
	 *
	 * @param uuid - The process ID returned by {@link Executor.start}
	 * @returns Promise resolving when the process has been stopped
	 *
	 * @example
	 * Executor.stop(uuid);
	 */
	stop(uuid: string): Promise<string>;

	/**
	 * Checks if a process is still running.
	 *
	 * @param uuid - The process ID returned by {@link Executor.start}
	 * @returns Promise resolving `true` if the process is running, `false` otherwise
	 *
	 * @example
	 * const isAlive = await Executor.isRunning(uuid);
	 */
	isRunning(uuid: string): Promise<boolean>;

	/**
	 * Stops the executor service completely.
	 *
	 * @returns Promise resolving when the service has been stopped
	 *
	 * @example
	 * Executor.stopService();
	 */
	stopService(): Promise<string>;

	/**
	 * Executes a shell command once and waits for it to finish.
	 * Unlike {@link Executor.start}, this does not stream output.
	 *
	 * @param command - The shell command to execute
	 * @param alpine - Whether to run the command in the Alpine sandbox (`true`) or Android environment (`false`)
	 * @returns Promise resolving with standard output on success, rejects with an error or standard error on failure
	 *
	 * @example
	 * Executor.execute('ls -l')
	 *   .then(console.log)
	 *   .catch(console.error);
	 */
	execute(command: string, alpine?: boolean): Promise<string>;

	/**
	 * Loads a native library from the specified path.
	 *
	 * @param path - The path to the native library to load
	 * @returns Promise resolving when the library has been loaded
	 *
	 * @example
	 * Executor.loadLibrary('/path/to/library.so');
	 */
	loadLibrary(path: string): Promise<string>;
}

/**
 * Global Executor instance for running shell commands.
 * This is the default executor module exported by the terminal-native Cordova plugin.
 * Use `Executor.BackgroundExecutor` for background process execution.
 */
declare const Executor: Executor;
