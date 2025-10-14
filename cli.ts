#!/usr/bin/env node

import prompts from "prompts";
import { spawnSync } from "child_process";
import kleur from "kleur";

// Handle Ctrl+C gracefully
let isSetupCancelled = false;
process.on('SIGINT', () => {
  isSetupCancelled = true;
  console.log('\n\nSetup cancelled by user.');
  process.exit(0);
});
process.on('SIGTERM', () => process.exit(0));

// Utility for running commands
function run(cmd: string, args: string[], cwd?: string) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}`);
  }
}

// Utility to create a box around text
function createBox(message: string) {
  const lines = message.split('\n');
  const maxLength = Math.max(...lines.map(line => {
    // Strip ANSI codes for length calculation
    return line.replace(/\u001b\[[0-9;]*m/g, '').length;
  }));
  const horizontalBorder = '─'.repeat(maxLength + 2);
  
  const box = [
    `╭${horizontalBorder}╮`,
    ...lines.map(line => `│ ${line.padEnd(maxLength + (line.length - line.replace(/\u001b\[[0-9;]*m/g, '').length))} │`),
    `╰${horizontalBorder}╯`
  ];
  
  return box.join('\n');
}

// Utility to get the correct shadcn add command for each package manager
function getShadcnAddCommand(packageManager: string): string {
  if (packageManager === 'pnpm') {
    return 'pnpm dlx shadcn@latest add button';
  } else if (packageManager === 'bun') {
    return 'bunx --bun shadcn@latest add button';
  } else if (packageManager === 'yarn') {
    return 'yarn shadcn@latest add button';
  } else {
    return 'npx shadcn@latest add button';
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
  ], {
    onCancel: () => {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }
  });

  // Check if user cancelled
  if (!response.projectName) {
    console.log('\n\nSetup cancelled by user.');
    process.exit(0);
  }

  // Trim project name
  response.projectName = response.projectName.trim();

  let alias = '@/*';
  if (response.importAlias === 'yes') {
    const aliasResponse = await prompts({
      type: 'text',
      name: 'alias',
      message: 'What import alias would you like configured?',
      initial: '@/*',
    }, {
      onCancel: () => {
        console.log('\n\nSetup cancelled by user.');
        process.exit(0);
      }
    });
    
    if (!aliasResponse.alias) {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }
    
    alias = aliasResponse.alias;
  }

  // Additional Shadcn prompt if Tailwind selected
  let shadcn = false;
  let packageManager = 'npm';
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
    }, {
      onCancel: () => {
        console.log('\n\nSetup cancelled by user.');
        process.exit(0);
      }
    });
    
    if (shadcnPrompt.shadcn === undefined) {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }
    
    shadcn = shadcnPrompt.shadcn;

    // Ask for package manager if Shadcn is selected
    if (shadcn) {
      const pmPrompt = await prompts({
        type: 'select',
        name: 'packageManager',
        message: 'Which package manager would you like to use for installing shadcn?',
        choices: [
          { title: 'npm (npx shadcn@latest init)', value: 'npm' },
          { title: 'yarn (yarn shadcn@latest init)', value: 'yarn' },
          { title: 'pnpm (pnpm dlx shadcn@latest init)', value: 'pnpm' },
          { title: 'bun (bunx --bun shadcn@latest init)', value: 'bun' },
        ],
        initial: 0,
      }, {
        onCancel: () => {
          console.log('\n\nSetup cancelled by user.');
          process.exit(0);
        }
      });
      
      if (!pmPrompt.packageManager) {
        console.log('\n\nSetup cancelled by user.');
        process.exit(0);
      }
      
      packageManager = pmPrompt.packageManager;
    }
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
  console.log('\nCreating Next.js application...\n');
  run('npx', ['create-next-app@latest', ...args]);

  console.log('\nNext.js application created successfully!\n');

  // Optionally run shadcn init
  if (shadcn) {
    // Temporarily remove SIGINT handler to allow Shadcn to handle Ctrl+C
    process.removeAllListeners('SIGINT');
    
    try {
      process.chdir(response.projectName);
      
      // First, install dependencies with the chosen package manager
      console.log(`\nInstalling dependencies with ${packageManager}...\n`);
      
      if (packageManager === 'yarn') {
        run('yarn', ['install']);
      } else if (packageManager === 'pnpm') {
        run('pnpm', ['install']);
      } else if (packageManager === 'bun') {
        run('bun', ['install']);
      } else {
        run('npm', ['install']);
      }
      
      // Run shadcn init with the appropriate command for each package manager
      console.log('\nInitializing Shadcn UI...\n');
      
      if (packageManager === 'pnpm') {
        run('pnpm', ['dlx', 'shadcn@latest', 'init']);
      } else if (packageManager === 'bun') {
        run('bunx', ['--bun', 'shadcn@latest', 'init']);
      } else if (packageManager === 'yarn') {
        run('yarn', ['shadcn@latest', 'init']);
      } else {
        // For npm, use npx
        run('npx', ['shadcn@latest', 'init']);
      }
    } catch (error) {
      // Clear some space and show user-friendly message without error details
      console.log('\n\n\n\n');
      console.log('Shadcn setup was cancelled or failed.');
      console.log('\nYour Next.js app has been set up successfully!');
      console.log(`   You can set up Shadcn UI later by running:`);
      console.log(`   cd ${response.projectName}`);
      
      if (packageManager === 'pnpm') {
        console.log(`   pnpm dlx shadcn@latest init`);
      } else if (packageManager === 'bun') {
        console.log(`   bunx --bun shadcn@latest init`);
      } else if (packageManager === 'yarn') {
        console.log(`   yarn shadcn@latest init`);
      } else {
        console.log(`   npx shadcn@latest init`);
      }
    }
  }
  
  // Display success message with useful information
  const successMessage = createBox(
    `${kleur.bold().green('Success!')} Your Next.js app is ready.\n\n` +
    `🚀 ${kleur.bold('Quick start')}:\n` +
    `   ${kleur.cyan(`cd ${response.projectName}`)}\n` +
    `   ${kleur.cyan(`${packageManager} run dev`)}\n\n` +
    `📚 ${kleur.bold('Resources')}:\n` +
    `   Shadcn UI: ${kleur.underline('https://ui.shadcn.com')}\n` +
    `   Next.js Docs: ${kleur.underline('https://nextjs.org/docs')}\n\n` +
    `⭐ ${kleur.bold('Star us on GitHub')}:\n` +
    `   ${kleur.underline('https://github.com/vedantlavale/create-next-shadcn')}\n\n` +
    `🎨 ${kleur.bold('Add components')}:\n` +
    `   ${kleur.cyan(getShadcnAddCommand(packageManager))}`
  );
  console.log('\n' + successMessage + '\n');
}

main();
