# Managing dependencies

**In this document**

-   [Working with a scope package](#working-with-a-scoped-package)
-   [Working with root](#working-with-root)

## Working with a Scoped package

### Add

```sh
lerna exec --scope @deriv/[Package] -- npm install [Package] --save
```

For example

```
lerna exec --scope @deriv/shared -- npm install sax --save
```

### Update

1. In root directory run update command

```sh
lerna exec --scope @deriv/[Package] -- npm update [package]
```

2. update the version in `package.json` for the package

For Example if you want update moment in core package:

1. `lerna exec --scope @deriv/core -- npm update moment`
2. upate the `package.json`

### Remove

```sh
lerna exec --scope @deriv/[Package] -- npm uninstall [package]
```

For example:

```sh
npx lerna exec --scope @deriv/shared -- npm uninstall sax --save
```

## Root

### Add

```sh
npm install package-name --save-dev
```

For example:

```sh
npm install --save-dev commitizen
```

### Update

```sh
npm update package-name
```

For example:

```sh
npm update eslint
```

### Remove

```sh
npm uninstall package-name
```

For example:

```sh
npm uninstall commitizen
```
