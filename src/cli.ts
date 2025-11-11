#!/usr/bin/env node

import kleur from "kleur";
import type { ProjectConfig } from './types';
import { run } from './utils/commands';
import { createBox } from './utils/ui';
import { 
  getShadcnAddCommand, 
  getShadcnInitCommand,
  getInstallCommand,
  getCreateNextAppCommand 
} from './utils/package-manager';
import {
  promptPackageManager,
  promptProjectName,
  promptSetupChoice,
  promptCustomConfig,
  promptImportAlias,
  promptShadcn
} from './prompts/setup';

// Handle Ctrl+C gracefully
let isSetupCancelled = false;
process.on('SIGINT', () => {
  isSetupCancelled = true;
  console.log('\n\nSetup cancelled by user.');
  process.exit(0);
});
process.on('SIGTERM', () => process.exit(0));

/**
 * Main CLI function
 */
async function main() {
  // Step 1: Ask for package manager
  const selectedPackageManager = await promptPackageManager();

  // Step 2: Ask for project name
  const projectName = await promptProjectName();

  // Step 3: Ask for setup preference
  const setupChoice = await promptSetupChoice();

  let config: ProjectConfig = {
    projectName,
    packageManager: selectedPackageManager,
    typescript: 'yes',
    eslint: 'yes',
    tailwind: 'yes',
    srcDir: 'no',
    appRouter: 'yes',
    turbopack: 'yes',
    importAlias: 'no',
    shadcn: false,
  };

  if (setupChoice === 'defaults') {
    // Use recommended defaults with Shadcn
    config.shadcn = true;
  } else if (setupChoice === 'reuse') {
    // TODO: Implement loading from previous settings
    console.log(kleur.yellow('\nReusing previous settings is not yet implemented.'));
    console.log(kleur.yellow('Falling back to customization mode...\n'));
    
    // Fall through to customize mode
    const customConfig = await promptCustomConfig();
    Object.assign(config, customConfig);

    // Handle import alias customization
    if (config.importAlias === 'yes') {
      config.alias = await promptImportAlias();
    }

    // Additional Shadcn prompt if Tailwind selected
    if (config.tailwind === 'yes') {
      config.shadcn = await promptShadcn();
    }
  } else if (setupChoice === 'customize') {
    // Ask all questions individually
    const customConfig = await promptCustomConfig();
    Object.assign(config, customConfig);

    // Handle import alias customization
    if (config.importAlias === 'yes') {
      config.alias = await promptImportAlias();
    }

    // Additional Shadcn prompt if Tailwind selected
    if (config.tailwind === 'yes') {
      config.shadcn = await promptShadcn();
    }
  }

  // Compose create-next-app args based on configuration
  const alias = config.alias || '@/*';
  const args = [
    config.projectName,
    '--yes', // Skip remaining prompts
    ...(config.typescript === 'yes' ? ['--ts'] : []),
    ...(config.eslint === 'yes' ? ['--eslint'] : []),
    ...(config.tailwind === 'yes' ? ['--tailwind'] : []),
    ...(config.srcDir === 'yes' ? ['--src-dir'] : []),
    ...(config.appRouter === 'yes' ? ['--app'] : []),
    ...(config.turbopack === 'yes' ? ['--turbopack'] : []),
    ...(config.importAlias === 'yes' ? ['--import-alias', alias] : []),
  ];

  // Run create-next-app with the selected package manager
  console.log('\nCreating Next.js application...\n');
  
  const [cmd, cmdArgs] = getCreateNextAppCommand(config.packageManager, args);
  run(cmd, cmdArgs);

  console.log('\nNext.js application created successfully!\n');

  // Optionally run shadcn init
  if (config.shadcn) {
    // Temporarily remove SIGINT handler to allow Shadcn to handle Ctrl+C
    process.removeAllListeners('SIGINT');
    
    try {
      process.chdir(config.projectName);
      
      // First, install dependencies with the chosen package manager
      console.log(`\nInstalling dependencies with ${config.packageManager}...\n`);
      
      const [installCmd, installArgs] = getInstallCommand(config.packageManager);
      run(installCmd, installArgs);
      
      // Run shadcn init with the appropriate command for each package manager
      console.log('\nInitializing Shadcn UI...\n');
      
      if (config.packageManager === 'pnpm') {
        run('pnpm', ['dlx', 'shadcn@latest', 'init']);
      } else if (config.packageManager === 'bun') {
        run('bunx', ['--bun', 'shadcn@latest', 'init']);
      } else if (config.packageManager === 'yarn') {
        run('yarn', ['shadcn@latest', 'init']);
      } else {
        run('npx', ['shadcn@latest', 'init']);
      }
    } catch (error) {
      // Clear some space and show user-friendly message without error details
      console.log('\n\n\n\n');
      console.log('Shadcn setup was cancelled or failed.');
      console.log('\nYour Next.js app has been set up successfully!');
      console.log(`   You can set up Shadcn UI later by running:`);
      console.log(`   cd ${config.projectName}`);
      console.log(`   ${getShadcnInitCommand(config.packageManager)}`);
    }
  }
  
  // Display success message with useful information
  const successMessage = createBox(
    `${kleur.bold().green('Success!')} Your Next.js app is ready.\n\n` +
    `🚀 ${kleur.bold('Quick start')}:\n` +
    `   ${kleur.cyan(`cd ${config.projectName}`)}\n` +
    `   ${kleur.cyan(`${config.packageManager} run dev`)}\n\n` +
    `📚 ${kleur.bold('Resources')}:\n` +
    `   Shadcn UI: ${kleur.underline('https://ui.shadcn.com')}\n` +
    `   Next.js Docs: ${kleur.underline('https://nextjs.org/docs')}\n\n` +
    `⭐ ${kleur.bold('Star us on GitHub')}:\n` +
    `   ${kleur.underline('https://github.com/vedantlavale/shadnex')}\n\n` +
    `🎨 ${kleur.bold('Add components')}:\n` +
    `   ${kleur.cyan(getShadcnAddCommand(config.packageManager))}`
  );
  console.log('\n' + successMessage + '\n');
}

main();
