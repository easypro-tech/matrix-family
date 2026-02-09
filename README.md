<!--
Project: matrix-family
Company: Matrix Family (matrix.family)
Dev: Brabus (EasyProTech)
Date: 2026-02-09 UTC
Status: Created
-->

# Matrix Family

Privacy-first communication ecosystem built on the Matrix protocol.

**Website:** [matrix.family](https://matrix.family)

## Repository Structure

This repository is a monorepo containing developer tools and reference implementations for the MFOS platform.

```
matrix-family/
├── mfos/                      # MFOS Platform Developer Tools
│   ├── app-template/          # Official app starter template
│   └── examples/
│       └── calculator/        # Reference implementation
├── hushme/                    # HushMe Ecosystem
│   └── store-apps/            # App submissions for HushMe Store
└── README.md
```

## MFOS Developer Tools

Tools for building applications on the MFOS platform.

### app-template

Official starter template for MFOS applications. Includes all required configuration, type definitions, and best practices.

```bash
cd mfos/app-template
bun install
bun run dev
```

### examples/calculator

Complete calculator application demonstrating:
- MFOS API integration
- State persistence with `mfos.storage`
- Localization with `mfos.i18n`
- UI components from `mfos.ui.components`
- CSS variables for theming

```bash
cd mfos/examples/calculator
bun install
bun run dev
```

## HushMe Store Apps

Submit your MFOS applications to [HushMe Store](https://hushme.store).

See [hushme/store-apps](hushme/store-apps) for submission guidelines and requirements.

## Documentation

Full documentation available at [mfos.tech](https://mfos.tech).

## Community

- [Discussions](https://github.com/easypro-tech/matrix-family/discussions) — questions, ideas, community apps
- [Issues](https://github.com/easypro-tech/matrix-family/issues) — bugs and actionable reports

## License

Only MFOS Developer Tools (`mfos/`) are licensed under the [MIT License](mfos/LICENSE).
Other parts of the repository may have different licensing terms.
