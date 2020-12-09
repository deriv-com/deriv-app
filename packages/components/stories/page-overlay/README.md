# PageOverlay component
To render a content in page overlay format use this component.

## Usage
 
```jsx
import { PageOverlay } from 'deriv-components';

const DummyComponent = (props) => (
    <PageOverlay 
        header={<h1>Page Header</h1>}
    >
        <div>
            <p>Page content</p>
        </div>
    </PageOverlay>
);
```

## Props

| Name                     | Type                   | Default            | Description                                                                                                                                              |
|--------------------------|------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| header                   | {string \| node }      | null               | Page header                                                                                                                                              |
| id                       | {string}               | null               | Id of the main wrapper of the component                                                                                                                  |
| portal_id                | {string}               | null               | If you want to render page in a react portal insert a dom's id                                                                                           |
| is\_open                 | {boolean}              | null               | If there is a 'portal\_id', set this props to 'true' to open the portal using 'react-transition-group' plugin                                            |
| onClickClose             | {function}             | null               | Callback function for clicking on close button in header if it's 'null' default function will change the page to previous location. (window.history.back) |

## Full example:

```jsx
import { PageOverlay } from 'deriv-components';

const DummyComponent = (props) => (
    <PageOverlay 
        header={<h1>Page Header</h1>}
        id={props.id}
        is_open={props.is_open}
        onClickClose={pops.onClickClose}
        portal_id={props.portal_id}
    >
        <div>
            <p>Page content</p>
        </div>
    </PageOverlay>
);
```
