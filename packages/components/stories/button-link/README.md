# ButtonLink Component

A button directs to a destination link.


#### Supported Gestures:

-   Click

#### Supported Events:

-   onClick

## Usage

```jsx
import ButtonLink from 'deriv-components';

const DummyComponent = props => (
   <ButtonLink
        to='#'
        onClick={() => { console.log('clicked'); }}
        size='medium'
    >
        <p>This is a button link</p>
    </ButtonLink>
);
```

## Props

| Name      | Type             | Default     | Description                                                       |
| --------- | ---------------- | ----------- | ----------------------------------------------------------------- |
| children  | {node object}    | null        | Elements inside ButtonLink                                        |
| to        | {string}         | null        | Destination link address                                          |
| onClick   | {function}       | undefined   | Function triggers when user clicks on ButtonLink                  |
| size      | {string}         | `'medium'`  | Size of ButtonLink. one of `'small'`, `'medium'`, or `'large'`    |
| className | {string}         | null        | Class name of the main container.                                 |


# Full example:

```jsx
import { BrowserRouter } from 'react-router-dom';
import ButtonLink from 'deriv-components';

const DummyComponent = props => (
    <React.Fragment>
        <div className={'buttonlink__wrapper'}>
            <BrowserRouter>
                <ButtonLink
                    to='#'
                    onClick={() => { console.log('clicked'); }}
                    size='medium'
                >
                    <p>This is a button link</p>
                </ButtonLink>
            </BrowserRouter>
        </div>
    </React.Fragment>
);
```
