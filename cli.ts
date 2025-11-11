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
  // First, ask for package manager
  const packageManagerResponse = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager would you like to use?',
    choices: [
      { title: 'npm', value: 'npm', description: 'npx create-next-app' },
      { title: 'pnpm', value: 'pnpm', description: 'pnpm dlx create-next-app' },
      { title: 'yarn', value: 'yarn', description: 'yarn create next-app' },
      { title: 'bun', value: 'bun', description: 'bun create next-app' },
    ],
    initial: 0,
  }, {
    onCancel: () => {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }
  });

  if (!packageManagerResponse.packageManager) {
    console.log('\n\nSetup cancelled by user.');
    process.exit(0);
  }

  const selectedPackageManager = packageManagerResponse.packageManager;

  // Then, ask for project name
  const projectNameResponse = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'What is your project named?',
    validate: (value) => {
      const trimmed = value.trim();
      return trimmed.length > 0 ? true : 'Project name cannot be empty';
    },
  }, {
    onCancel: () => {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }
  });

  if (!projectNameResponse.projectName) {
    console.log('\n\nSetup cancelled by user.');
    process.exit(0);
  }

  const projectName = projectNameResponse.projectName.trim();

  // Ask for setup preference (like create-next-app does)
  const setupChoice = await prompts({
    type: 'select',
    name: 'choice',
    message: 'Would you like to use the recommended Next.js defaults?',
    choices: [
      { 
        title: 'Yes, use recommended defaults', 
        value: 'defaults',
        description: 'TypeScript, ESLint, Tailwind CSS, App Router, Turbopack, Shadcn UI'
      },
      { 
        title: 'No, reuse previous settings', 
        value: 'reuse',
        description: 'Use settings from your last project'
      },
      { 
        title: 'No, customize settings', 
        value: 'customize',
        description: 'Manually configure each option'
      },
    ],
    initial: 0,
  }, {
    onCancel: () => {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }
  });

  if (!setupChoice.choice) {
    console.log('\n\nSetup cancelled by user.');
    process.exit(0);
  }

  let response: any = { projectName, packageManager: selectedPackageManager };

  if (setupChoice.choice === 'defaults') {
    // Use recommended defaults with Shadcn
    response.typescript = 'yes';
    response.eslint = 'yes';
    response.tailwind = 'yes';
    response.srcDir = 'no';
    response.appRouter = 'yes';
    response.turbopack = 'yes';
    response.importAlias = 'no';
    response.shadcn = true;

  } else if (setupChoice.choice === 'reuse') {
    // TODO: Implement loading from previous settings
    console.log(kleur.yellow('\nReusing previous settings is not yet implemented.'));
    console.log(kleur.yellow('Falling back to customization mode...\n'));
    setupChoice.choice = 'customize';
  }
  
  if (setupChoice.choice === 'customize') {
    // Ask all questions individually
    const customResponses = await prompts([
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
    if (!customResponses.typescript) {
      console.log('\n\nSetup cancelled by user.');
      process.exit(0);
    }

    // Merge custom responses
    Object.assign(response, customResponses);

    // Handle import alias customization
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
      response.alias = alias;
    }

    // Additional Shadcn prompt if Tailwind selected
    response.shadcn = false;
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
      
      response.shadcn = shadcnPrompt.shadcn;
    }
  }

  // Compose create-next-app args based on answers
  const alias = response.alias || '@/*';
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

  // Get the selected package manager
  const packageManager = response.packageManager || 'npm';

  // Run create-next-app with the selected package manager
  console.log('\nCreating Next.js application...\n');
  
  if (packageManager === 'npm') {
    run('npx', ['create-next-app@latest', ...args]);
  } else if (packageManager === 'pnpm') {
    run('pnpm', ['dlx', 'create-next-app@latest', ...args]);
  } else if (packageManager === 'yarn') {
    run('yarn', ['create', 'next-app', ...args]);
  } else if (packageManager === 'bun') {
    run('bun', ['create', 'next-app', ...args]);
  }

  console.log('\nNext.js application created successfully!\n');

  // Optionally run shadcn init
  if (response.shadcn) {
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
    `   ${kleur.underline('https://github.com/vedantlavale/shadnex')}\n\n` +
    `🎨 ${kleur.bold('Add components')}:\n` +
    `   ${kleur.cyan(getShadcnAddCommand(packageManager))}`
  );
  console.log('\n' + successMessage + '\n');
}

main();
