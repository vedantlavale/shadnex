import prompts from 'prompts';
import type { PackageManager, ProjectConfig, SetupChoice } from '../types';

const onCancel = () => {
  console.log('\n\nSetup cancelled by user.');
  process.exit(0);
};

/**
 * Prompt for package manager selection
 */
export async function promptPackageManager(): Promise<PackageManager> {
  const response = await prompts({
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
  }, { onCancel });

  if (!response.packageManager) {
    onCancel();
  }

  return response.packageManager;
}

/**
 * Prompt for project name
 */
export async function promptProjectName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'What is your project named?',
    validate: (value) => {
      const trimmed = value.trim();
      return trimmed.length > 0 ? true : 'Project name cannot be empty';
    },
  }, { onCancel });

  if (!response.projectName) {
    onCancel();
  }

  return response.projectName.trim();
}

/**
 * Prompt for setup preference
 */
export async function promptSetupChoice(): Promise<SetupChoice> {
  const response = await prompts({
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
  }, { onCancel });

  if (!response.choice) {
    onCancel();
  }

  return response.choice;
}

/**
 * Prompt for custom configuration
 */
export async function promptCustomConfig(): Promise<Partial<ProjectConfig>> {
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
  ], { onCancel });

  // Check if user cancelled
  if (!customResponses.typescript) {
    onCancel();
  }

  return customResponses;
}

/**
 * Prompt for import alias customization
 */
export async function promptImportAlias(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'alias',
    message: 'What import alias would you like configured?',
    initial: '@/*',
  }, { onCancel });
  
  if (!response.alias) {
    onCancel();
  }
  
  return response.alias;
}

/**
 * Prompt for Shadcn installation
 */
export async function promptShadcn(): Promise<boolean> {
  const response = await prompts({
    type: 'select',
    name: 'shadcn',
    message: 'Install Shadcn UI?',
    choices: [
      { title: 'Yes', value: true },
      { title: 'No', value: false },
    ],
    initial: 0,
  }, { onCancel });
  
  if (response.shadcn === undefined) {
    onCancel();
  }
  
  return response.shadcn;
}
