# Shadnex

<div align="center">

[![npm version](https://img.shields.io/npm/v/shadnex.svg)](https://www.npmjs.com/package/shadnex)
[![npm downloads](https://img.shields.io/npm/dm/shadnex.svg)](https://www.npmjs.com/package/shadnex)
![GitHub stars](https://img.shields.io/github/stars/vedantlavale/shadnex.svg)](https://github.com/vedantlavale/shadnex)
![GitHub issues](https://img.shields.io/github/issues/vedantlavale/shadnex.svg)](https://github.com/vedantlavale/shadnex/issues)
<br>
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-FBF0DF?style=for-the-badge&logo=bun&logoColor=000000)

**The ultimate CLI for creating Next.js applications with Shadcn UI (command: `shadnex`)**

</div>

---

## ✨ Overview

`shadnex` is an interactive CLI tool that streamlines the process of setting up modern Next.js applications with Shadcn UI. It combines the power of Next.js with the beauty of Shadcn UI components, providing a seamless development experience from project initialization to component installation.

## 🚀 Quick Start

```bash
# Create a new Next.js project with Shadnex (no install required)
npx shadnex@latest

# Or install globally first
npm install -g shadnex
shadnex
```

## 🚀 Features

- **🎯 Interactive Setup** - Guided prompts for all configuration options
- **⚡ Modern Stack** - Next.js 14+ with App Router and Turbopack support
- **🎨 Shadcn UI Integration** - Automatic installation and configuration
- **🔧 Flexible Configuration** - TypeScript, ESLint, Tailwind CSS, and more
- **📦 Package Manager Support** - npm, yarn, pnpm, and bun
- **🎭 Beautiful Terminal UI** - Colorful, boxed output with clear instructions
- **🛡️ Error Handling** - Graceful cancellation and error recovery

## 📦 Installation

### Using npx (Recommended - No Installation Required)

```bash
npx shadnex@latest
```

### Global Installation

Install globally to use the `shadnex` command anywhere:

```bash
# Using npm
npm install -g shadnex

# Using yarn
yarn global add shadnex

# Using pnpm
pnpm add -g shadnex

# Using bun
bun add -g shadnex
```

### Local Installation

For development or testing:

```bash
# Clone the repository
git clone https://github.com/vedantlavale/shadnex.git
cd shadnex

# Install dependencies
bun install

# Run locally (dev)
bun run cli.ts
```

## 🛠️ Usage

### Basic Usage

```bash
# Using npx (recommended - no installation needed)
npx shadnex@latest

# After global installation
shadnex

# Local development
bun run cli.ts
```

### Interactive Setup

The CLI will guide you through a series of questions to configure your project:

1. **Project Name** - Enter your desired project name
2. **TypeScript** - Choose whether to use TypeScript (recommended)
3. **ESLint** - Enable ESLint for code quality
4. **Tailwind CSS** - Include Tailwind CSS for styling
5. **Source Directory** - Choose between `src/` or root directory structure
6. **App Router** - Use Next.js 13+ App Router (recommended)
7. **Turbopack** - Enable Turbopack for faster builds
8. **Import Alias** - Customize the import alias (default: `@/*`)
9. **Shadcn UI** - Install and configure Shadcn UI (requires Tailwind)
10. **Package Manager** - Choose package manager for Shadcn installation

### Example Output

```
╭────────────────────────────────────────────────────────────╮
│ What is your project named?                                │
╰────────────────────────────────────────────────────────────╯

my-awesome-app

╭────────────────────────────────────────────────────────────╮
│ Would you like to use TypeScript? (Y/n)                    │
╰────────────────────────────────────────────────────────────╯

Yes

[... more prompts ...]

╭────────────────────────────────────────────────────────────╮
│ SUCCESS Your Next.js app is ready!                        │
│                                                           │
│ ┌───────────────────────────────────────────┐             │
│ │ 🚀 QUICK START                              │             │
│ │    01 cd my-awesome-app                      │             │
│ │    02 npm run dev                           │             │
│ └───────────────────────────────────────────┘             │
│                                                           │
│ [... more sections ...]                                   │
╰────────────────────────────────────────────────────────────╯
```

## ⚙️ Configuration Options

| Option | Description | Default | Choices |
|--------|-------------|---------|---------|
| **Project Name** | Your application name | - | Any valid name |
| **TypeScript** | Enable TypeScript support | Yes | Yes/No |
| **ESLint** | Enable ESLint linting | Yes | Yes/No |
| **Tailwind CSS** | Include Tailwind CSS | Yes | Yes/No |
| **Source Directory** | Use `src/` directory | No | Yes/No |
| **App Router** | Use Next.js App Router | Yes | Yes/No |
| **Turbopack** | Enable Turbopack bundler | Yes | Yes/No |
| **Import Alias** | Custom import alias | `@/*` | Any alias |
| **Shadcn UI** | Install Shadcn UI | Yes | Yes/No |
| **Package Manager** | Package manager for Shadcn | npm | npm/yarn/pnpm/bun |

## 📁 Project Structure

After running `npx shadnex@latest` or `shadnex`, you'll get a fully configured Next.js project:

```
my-awesome-app/
├── app/                    # App Router directory (if selected)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Shadcn UI components (if installed)
│   ├── ui/               # UI component library
│   └── ...
├── lib/                  # Utility functions
│   └── utils.ts          # Utility functions
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── components.json       # Shadcn UI configuration
└── next.config.js        # Next.js configuration
```

## 🎨 Adding Components

Once your project is set up with Shadcn UI, you can easily add components:

```bash
# Navigate to your project
cd my-awesome-app

# Add a component
npx shadcn-ui@latest add button

# Add multiple components
npx shadcn-ui@latest add button card input
```

## 🔧 Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (for development)

### Local Development

```bash
# Clone the repository
git clone https://github.com/vedantlavale/shadnex.git
cd shadnex

# Install dependencies
bun install

# Run the CLI
bun run cli.ts

# Or for development testing
bun run index.ts
```

### Building

```bash
# Build the project for distribution
bun run build

# The built CLI will be in ./dist/cli.js
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/shadnex.git`
3. Install dependencies: `bun install`
4. Make your changes
5. Test your changes: `bun run cli.ts`
6. Submit a pull request

### Issues and Feature Requests

- 🐛 [Bug Reports](https://github.com/vedantlavale/shadnex/issues/new?template=bug_report.md)
- 💡 [Feature Requests](https://github.com/vedantlavale/shadnex/issues/new?template=feature_request.md)
- ❓ [Questions](https://github.com/vedantlavale/shadnex/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

- 📧 **Email**: vedantlavale.work@gmail.com
- 💬 **Discord**: [Join our community](https://discord.gg/qUVfPqT3F6)

---

<div align="center">

**Made with ❤️ by [Vedant](https://github.com/vedantlavale)**

[![npm](https://img.shields.io/npm/v/shadnex.svg)](https://www.npmjs.com/package/shadnex)
[![GitHub](https://img.shields.io/github/stars/vedantlavale/shadnex.svg)](https://github.com/vedantlavale/shadnex)

[⭐ Star on GitHub](https://github.com/vedantlavale/shadnex) • [📦 Install from npm](https://www.npmjs.com/package/shadnex) • [🚀 Get started](#-installation)

</div>
