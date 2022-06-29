<h1 align="center">
  @deriv/p2p
</h1>

This repository is a workspace of [deriv-app](../../README.md) monorepo and covers the components and logics of [p2p](https://app.deriv.com/cashier/p2p) from cashier menu in app.deriv.com .

> to access the p2p section you need to login and switch to your real account.

**these are the routes used in app.deriv.com for this package:**

```
    cashier_p2p: '/cashier/p2p',
    cashier_p2p_verification: '/cashier/p2p/verification',
```

## How to Install the Project

You need to follow the instructions [here](../../README.md).

## How To Work With This Project

To run and work on this workspace you need to run `npm run serve core` , `npm run serve cashier`, and `npm run serve p2p`.
Webpack will watch changes in `p2p` and `cashier` so that if you made any changes in this package, it will automatically rebuild `p2p` and `cashier` and recompile `core`.

**Libary usage:**

```
import P2P from '@deriv/p2p';

<P2P />;
```

## Folder Structure

```
crowdin
    ├── message.json
scripts
    ├── extract-string.js
    ├── extract-translations.js
    ├── update-translations.sh
src
    ├── assets
    ├── components
    ├── constants
    ├── stores
    ├── translations
    ├── utils
    │   ├── validations.js
    │   ├── websocket.js

// message.json ??
// scripts ??
// websocket ??
```

## Troubleshooting
