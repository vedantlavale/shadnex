#!/usr/bin/env bun

import prompts from "prompts";
import { spawnSync } from "bun";

// Handle Ctrl+C
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

// Utility for running commands
function run(cmd: string, args: string[], cwd?: string) {
  const result = spawnSync([cmd, ...args], {
    cwd,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  
  if (result.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${result.exitCode}`);
  }
}

// Interactive CLI
async function main() {
  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      validate: (value) => {
        const trimmed = value.trim();
        return trimmed.length > 0 ? true : 'Project name cannot be empty';
      },
    },
    {
      type: 'select',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 1,
    },
    {
      type: 'select',
      name: 'eslint',
      message: 'Would you like to use ESLint?',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 1,
    },
    {
      type: 'select',
      name: 'tailwind',
      message: 'Would you like to use Tailwind CSS?',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 1,
    },
    {
      type: 'select',
      name: 'srcDir',
      message: 'Would you like your code inside a `src/` directory?',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'appRouter',
      message: 'Would you like to use App Router? (recommended)',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 1,
    },
    {
      type: 'select',
      name: 'turbopack',
      message: 'Would you like to use Turbopack? (recommended)',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 1,
    },
    {
      type: 'select',
      name: 'importAlias',
      message: 'Would you like to customize the import alias (`@/*` by default)?',
      choices: [
        { title: 'No', value: 'no' },
        { title: 'Yes', value: 'yes' },
      ],
      initial: 0,
    },
  ]);

  // Trim project name
  response.projectName = response.projectName.trim();

  let alias = '@/*';
  if (response.importAlias === 'yes') {
    const aliasResponse = await prompts({
      type: 'text',
      name: 'alias',
      message: 'What import alias would you like configured?',
      initial: '@/*',
    });
    alias = aliasResponse.alias;
  }

  // Additional Shadcn prompt if Tailwind selected
  let shadcn = false;
  if (response.tailwind === 'yes') {
    const shadcnPrompt = await prompts({
      type: 'select',
      name: 'shadcn',
      message: 'Install Shadcn UI?',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 0,
    });
    shadcn = shadcnPrompt.shadcn;
  }

  // Compose create-next-app args based on answers
  const args = [
    response.projectName,
    '--yes', // Skip remaining prompts
    ...(response.typescript === 'yes' ? ['--ts'] : []),
    ...(response.eslint === 'yes' ? ['--eslint'] : []),
    ...(response.tailwind === 'yes' ? ['--tailwind'] : []),
    ...(response.srcDir === 'yes' ? ['--src-dir'] : []),
    ...(response.appRouter === 'yes' ? ['--app'] : []),
    ...(response.turbopack === 'yes' ? ['--turbopack'] : []),
    ...(response.importAlias === 'yes' ? ['--import-alias', alias] : []),
  ];

  // Run create-next-app
  run('npx', ['create-next-app@latest', ...args]);

  // Optionally run shadcn init
  if (shadcn) {
    try {
      process.chdir(response.projectName);
      run('npx', ['shadcn@latest', 'init']);
    } catch (error) {
      console.error('Failed to install Shadcn UI:', error);
    }
  }
}

main();
