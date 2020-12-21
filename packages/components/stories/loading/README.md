# Loading Component

A `Loading` component.



## Usage

```jsx
import Loading from 'deriv-components';

const DummyComponent = props => (
    <Loading
        is_fullscreen
        is_slow_loading
        status={['Checking your balance...']}
    />
);
```

## Props

| Name             | Type               | Default     | Description                                         |
| ---------------- | ------------------ | ----------- | --------------------------------------------------- |
| id               | {string}           | null        | `id` for the loading                                |
| is_fullscreen    | {boolean}          | `true`      | Defines whether the loading is fullscreen or not    |
| is\_slow\_loading| {boolean}          | null        | Defines whether the loading is slow or not          |
| status           | [string]           | null        | List of strings showes at the bottom of the loading |
| theme            | {string}           | `'light'`   | Theme of the loading                                |
| className        | {string}           | null        | `className` for the main container                  |


# Full example:

```jsx
import React from 'react';
import Loading from 'deriv-components';

const DummyComponent = props => {
    
    return (
        <React.Fragment>
            <Loading
                is_fullscreen
                is_slow_loading
                status={['Checking your balance...']}
            />
        </React.Fragment>
    )
}
```