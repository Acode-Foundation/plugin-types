declare namespace Acode {
	type CommandBinding =
		| string
		| {
				win?: string;
				linux?: string;
				mac?: string;
		  };

	interface CommandDescriptor {
		name: string;
		description?: string;
		bindKey?: CommandBinding;
		exec: (
			view: Ace.Editor & EditorLike,
			args?: unknown,
		) => MaybePromise<boolean | undefined>;
	}

	interface CommandRegistry {
		add(descriptor: CommandDescriptor): void;
		remove(name: string): void;
		execute(
			name: string,
			view?: Ace.Editor & EditorLike,
			args?: unknown,
		): MaybePromise<boolean | undefined>;
		list(): CommandDescriptor[];
	}

	interface Commands {
		addCommand(descriptor: CommandDescriptor): void;
		removeCommand(name: string): void;
		registry: CommandRegistry;
	}
}
