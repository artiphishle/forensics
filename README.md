# Forensics

Tool to visualize packages and their dependencies between each other. This project is inspired by [socomo](https://github.com/gdela/socomo).

Good software architecture starts with matching functional requirements to code structure.
Visualizing and showing the dependencies of packages in your project is the first step to regain control of your project.

## Prerequisites

Make sure to have PNPM & Node installed, check `package.json` for allowed versions

## Quickstart

```bash
# 1. Install dependencies
pnpm install

# 2. Create your .env file
cp .env.tpl .env

# 3. Supply the project path to analyze in the .env file

# 4. Run the app
pnpm run dev
```

## Test

```bash
# Run tests
pnpm test

# Print Coverage to stdout
pnpm test:cov

# Generate HTML Coverage to 'test/coverage/index.html'
pnpm test:cov:html
```

## Contributing

The list of open source tools to visualize code structure is rather short. Structure101 is now part of Sonar. Don't let paid tools dominate software craft. Join us and contribute to open-source!
