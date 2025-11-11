# Source Code Structure

This directory contains the main source code for the Shadnex CLI tool.

## Directory Structure

```
src/
├── cli.ts                  # Main CLI entry point
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   ├── commands.ts        # Command execution utilities
│   ├── ui.ts             # UI utilities (box drawing, etc.)
│   └── package-manager.ts # Package manager specific utilities
└── prompts/
    └── setup.ts           # Interactive prompt definitions
```

## Modules

### `cli.ts`
Main entry point for the CLI. Orchestrates the entire setup flow:
- Prompts for package manager selection
- Prompts for project configuration
- Creates Next.js project
- Optionally sets up Shadcn UI

### `types/`
Contains TypeScript type definitions used throughout the application:
- `PackageManager`: Union type for supported package managers
- `ProjectConfig`: Interface for project configuration
- `SetupChoice`: Union type for setup preferences

### `utils/`
Utility functions organized by concern:

#### `commands.ts`
- `run()`: Executes shell commands with proper error handling

#### `ui.ts`
- `createBox()`: Creates styled terminal boxes for messages

#### `package-manager.ts`
Package manager specific utilities:
- `getShadcnAddCommand()`: Get the correct Shadcn add command
- `getShadcnInitCommand()`: Get the correct Shadcn init command
- `getInstallCommand()`: Get the correct install command
- `getCreateNextAppCommand()`: Get the correct create-next-app command

### `prompts/`
Interactive prompt definitions using the `prompts` library:
- `promptPackageManager()`: Ask user for package manager preference
- `promptProjectName()`: Ask for project name
- `promptSetupChoice()`: Ask for setup preference (defaults/customize)
- `promptCustomConfig()`: Ask for custom configuration options
- `promptImportAlias()`: Ask for custom import alias
- `promptShadcn()`: Ask whether to install Shadcn UI

## Development

To run the CLI in development mode:
```bash
bun run dev
```

To build the CLI:
```bash
bun run build
```

The built output will be in the `dist/` directory.
