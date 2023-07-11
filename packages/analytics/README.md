# `@deriv/analytics`

The analytics package contains all the utility functions used for tracking user events and sending them to the respective platform such as Rudderstack.

**In this document**

-   [RudderStack](#rudderstack)
    -   [What is RudderStack?](#what-is-rudderstack)
    -   [Installation](#installation)
    -   [Usage](#usage)
    -   [API Reference](#api-reference)

## RudderStack

### What is RudderStack?

RudderStack is a platform that allows you to easily connect different analytical tools and applications such as Google Analytics, and send data and events to the respective tool/application that requires it. Events sent to RudderStack will be routed to the respective tool and application, similar to a reverse proxy but for data and analytics.

### Installation

To start tracking with Rudderstack, first add it as a dependency in `package.json`:

```js
{
    ...
    "dependencies": {
        ...
        "@deriv/analytics": "^1.0.0",
        ...
    }
    ...
}
```

Then run `npm run bootstrap:dev` as well as `npm run build:all` to install the dependencies and build it.
If there are issues with importing the package and your project has an `externals` field in the Webpack config file, within the project's `webpack.config.js` file, add the following fields:

```json
{
    ...
    "externals": [
        {
            ...
            '@deriv/analytics': '@deriv/analytics'
            ...
        },
        ...
        /^@deriv\/analytics\/.+$/,
        ...
    ],
}
```

### Usage

To start using it, import the SDK by calling (ensure that the camelcase spelling is correct, it is `Rudder Stack` not `Rudder stack`). The RudderStack SDK will be automatically instantiated and loaded when importing it:

```js
import { RudderStack } from '@deriv/analytics';
```

If the environment is either staging or production, the RudderStack SDK instance will be automatically created and initialized, provided that the environment variable keys `RUDDERSTACK_STAGING_KEY`, `RUDDERSTACK_PRODUCTION_KEY` and `RUDDERSTACK_URL` has been set. To start using it in a development environment, make sure the following environment variables are set locally:

```env
CIRCLE_JOB=release_staging
RUDDERSTACK_STAGING_KEY=...
RUDDERSTACK_URL=...
```

#### Tracking authenticated users

To start tracking users that has been authenticated, begin by calling `RudderStack.identifyEvent` and providing the user's ID as well as any additional information such as the language of the platform:

```js
RudderStack.identifyEvent('CR90000438', {
    language: 'EN',
});
```

This event is recommended to be called after the websocket returns an `authorize` response.

Once `identifyEvent` has been called, events sent using `RudderStack.track` will be tracked and associated to the authenticated user by their ID.
Note that at the moment, the `RudderStack` implementation only tracks authenticated users and not users who have not logged in. So in order to start tracking, the user must be identified first using `identifyEvent`.

### API Reference

#### identifyEvent

```js
Rudderstack.identifyEvent(user_id, payload);
```

| Parameter | Type                 | Description                                                                         |
| --------- | -------------------- | ----------------------------------------------------------------------------------- |
| user_id   | string               | The users' login ID                                                                 |
| payload   | { language: string } | Contains user's session details such as the platform language they are currently in |

Identifies the user to Rudderstack and associates all events tracked to the user. For example:

```js
Rudderstack.identifyEvent('C123456', {
    language: 'EN',
});
```

#### pageView

```js
Rudderstack.pageView(current_page);
```

| Parameter    | Type   | Description                   |
| ------------ | ------ | ----------------------------- |
| current_page | string | The name of the page to track |

Tracks the current page view. For example:

```js
Rudderstack.pageView('Deriv.app');
```

#### track

```js
Rudderstack.track(event, payload);
```

| Parameter | Type                                                                                                                                                                                  | Description                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| event     | string type with one of these events:<br> - `ce_virtual_signup_form`<br> - `ce_real_account_signup_form`<br> - `ce_virtual_signup_email_confirmation`<br> - `ce_trade_types_form`<br> | The name of the event to track                    |
| payload   | object                                                                                                                                                                                | The properties and data associated with the event |

For example, to track the event `ce_trade_types_form` for the action `search`:

```js
Rudderstack.track('ce_trade_types_form', {
    action: 'search',
    search_string: 'What are multipliers',
});
```
