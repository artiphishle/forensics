![issues](https://img.shields.io/github/issues/artiphishle/pkgviz?style=flat-square)
![PRs](https://img.shields.io/github/issues-pr/artiphishle/pkgviz?style=flat-square)

# Package Visualizer

Tool to visualize packages and their dependencies between each other. This project is inspired by [socomo](https://github.com/gdela/socomo).

Good software architecture starts with matching functional requirements to code structure.
Visualizing and showing the dependencies of packages in your project is the first step to regain control of your project.

## Prerequisites

Make sure to have PNPM & Node installed, check `package.json` for allowed versions

## Quickstart

```bash
# 1. Install dependencies
bun install
yarn install
pnpm install
npm install

# 2. Create your .env file
cp .env.tpl .env

# 3. Supply the project path to analyze in the .env file

# 4. Run the app
bun run dev
yarn run dev
pnpm run dev
npm run dev
```

## Documentation

Find the official documentation at Github Pages here:

[artiphishle.github.io/forensics-docs](https://artiphishle.github.io/forensics-docs/)

## Test

```bash
# Run tests
bun run test
yarn run test
pnpm run test
npm run test

# Print Coverage to stdout
bun run test:cov
yarn run test:cov
pnpm run test:cov
npm run test:cov

# Generate HTML Coverage to 'test/coverage/index.html'
bun test:cov:html
yarn test:cov:html
pnpm test:cov:html
npm test:cov:html
```

## Contributing

The list of open source tools to visualize code structure is rather short. Structure101 is now part of Sonar. Don't let paid tools dominate software craft. Join us and contribute to open-source!
