<h1 align="center">
  @deriv/dashboard
</h1>

## Index

-   [General](docs/README.md) - Contains general philosophy and overview of this package
-   [Modules docs](docs/Modules/README.md) - Contains implementation guides (i.e., adding types, use observer, etc.)

## Requirements

-   node
-   npm

## Editor helpers

-   Prettier setup in your editor https://prettier.io/
-   Stylelint setup in your editor https://stylelint.io/
-   Eslint setup in your editor https://eslint.org/

## 🚀 Quick start

1.  **Install your dependencies:**

    ```sh
    npm run bootstrap
    ```

2.  **To build publish file:**

    ```sh
    npm run build:publish dashboard
    ```

3.  **Libary usage:**

        ```jsx
        import React from 'react'
        import Dashboard from '@deriv/dashboard';

        const Component = ({client, ServerTIme, ui, WS, config}) => {
            return <Dashboard client={client} server_time={ServerTime} ui={ui} ws={WS} config={config} />;
        }


        Component.propTypes = {
            client: PropTypes.shape({
                is_logged_in: PropTypes.bool.isRequired,
                loginid: PropTypes.string.isRequired,
            }).isRequired,
            config: {
                asset_path: PropTypes.string.isRequired,
                has_router: PropTypes.bool.isRequired,
                is_deriv_crypto: PropTypes.bool.isRequired,
                routes: PropTypes.shape({
                    home: PropTypes.string.isRequired,
                    about_us: PropTypes.string.isRequired,
                    explore: PropTypes.string.isRequired,
                    resources: PropTypes.string.isRequired,
                }).isRequired,
            },
            ui: PropTypes.shape({
                height_offset: PropTypes.string,
                is_dark_mode_on: PropTypes.bool.isRequired,
                language: PropTypes.string.isRequired,
                components: PropTypes.shape({
                    LoginPrompt: any,
                    Page404: any,
                }).isRequired,
        }).isRequired,

    };

    ```

    ```

4.  **File Structure**

```
src
    ├── assets/
    │   ├── images/
    ├── components/
    │   ├── ...
    ├── constants/
    │   ├── ...
    ├── stores/
    │   ├── ...
    ├── types/
    │   ├── ...
    ├── index.js

index.js // publish file
webpack.config.js
package.json
```
