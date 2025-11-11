import type { PackageManager } from '../types';

/**
 * Get the correct shadcn add command for each package manager
 */
export function getShadcnAddCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm dlx shadcn@latest add button';
    case 'bun':
      return 'bunx --bun shadcn@latest add button';
    case 'yarn':
      return 'yarn shadcn@latest add button';
    case 'npm':
    default:
      return 'npx shadcn@latest add button';
  }
}

/**
 * Get the correct shadcn init command for each package manager
 */
export function getShadcnInitCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm dlx shadcn@latest init';
    case 'bun':
      return 'bunx --bun shadcn@latest init';
    case 'yarn':
      return 'yarn shadcn@latest init';
    case 'npm':
    default:
      return 'npx shadcn@latest init';
  }
}

/**
 * Get install command for the package manager
 */
export function getInstallCommand(packageManager: PackageManager): [string, string[]] {
  switch (packageManager) {
    case 'yarn':
      return ['yarn', ['install']];
    case 'pnpm':
      return ['pnpm', ['install']];
    case 'bun':
      return ['bun', ['install']];
    case 'npm':
    default:
      return ['npm', ['install']];
  }
}

/**
 * Get the create-next-app command for each package manager
 */
export function getCreateNextAppCommand(packageManager: PackageManager, args: string[]): [string, string[]] {
  switch (packageManager) {
    case 'pnpm':
      return ['pnpm', ['dlx', 'create-next-app@latest', ...args]];
    case 'yarn':
      return ['yarn', ['create', 'next-app', ...args]];
    case 'bun':
      return ['bun', ['create', 'next-app', ...args]];
    case 'npm':
    default:
      return ['npx', ['create-next-app@latest', ...args]];
  }
}
