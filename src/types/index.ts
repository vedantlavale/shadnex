export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface ProjectConfig {
  projectName: string;
  packageManager: PackageManager;
  typescript: 'yes' | 'no';
  eslint: 'yes' | 'no';
  tailwind: 'yes' | 'no';
  srcDir: 'yes' | 'no';
  appRouter: 'yes' | 'no';
  turbopack: 'yes' | 'no';
  importAlias: 'yes' | 'no';
  alias?: string;
  shadcn: boolean;
}

export type SetupChoice = 'defaults' | 'reuse' | 'customize';
