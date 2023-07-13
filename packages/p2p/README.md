# `@deriv/p2p`

P2P platform serves as the facilitator of the trade by providing a platform for buyers and sellers to broadcast their offers. At the same time, the escrow services of online digital asset ensure the safety and timely delivery of digital asset during trade execution.
This repository is a workspace of [deriv-app](../../README.md) monorepo and is responsible for components and logics of [p2p](https://app.deriv.com/cashier/p2p) from cashier menu in app.deriv.com .

> **Note**: to access the p2p section you need to login and switch to your real account.

**these are the routes used in app.deriv.com for this workspace:**

```
    cashier_p2p: '/cashier/p2p',
    p2p_verification: '/cashier/p2p/verification',
```

## How to Install the workspace

You need to follow the instructions [here](../../README.md).

## How To Work With This workspace

To run and work on this workspace you need to run `npm run serve core` , `npm run serve cashier`, and `npm run serve p2p`.
Webpack will watch changes in `p2p` and `cashier` so that if you made any changes in them, it will automatically rebuild `p2p` and `cashier` and recompile `core`.

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

```

**components:** This folder contains all the reusable components that we need for developing this workspace.
We have a separate folder for each component.

**constants:** We add the static data structures needed for the workspace here.

**stores:** We use Mobx as state management tool, and this is the place for putting the relevant store files.

**utils:** We place all the common and helper methods which are required for the workspace in this folder.

<!-- TODO: explain the purpose of crowdin folder -->
