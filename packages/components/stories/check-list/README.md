# CheckList Component

A list of items with an action button or with done status


#### Supported Gestures:

-   Click

## Usage

```jsx
import Checklist from 'deriv-components';

const DummyComponent = props => (
  <Checklist items={list} />
);
```

## Props

| Name               | Type         | Default     | Description                                        |
| ------------------ | ------------ | ----------- | -------------------------------------------------- |
| items              | [object]     | null        | List of Items                                      |
| className          | {string}     | null        | The classname for the Checkbox wrapper             |
| itemClassName      | {string}     | null        | The classname for the items of the Checkbox        |


## `Items` Structure
The `items` prop should be an array of these objects:

| Name               | Type         | Default     | Description                                                                                           |
| ------------------ | ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| content            | {string}     | null        | Main text of the item.                                                                                |
| status             | {string}     | `'action'`  | Type of the item. One of `action`, `button-action` or `done`.                                         |
| onClick            | {function}   | null        | Callback function triggers when user clicks on the item button. (for `action` and `button-action`)    |
| button_text        | {string}     | null        | Button text if the type is `button-action`.                                                           |



# Full example:

```jsx
import React, { useState } from 'react';
import Checkbox from 'deriv-components';

const DummyComponent = props => {

    const list = [
            {
                content: 'Item with an action',
                status: 'action',
                onClick: () => console.log('clicked'),
            },
            {
                content: 'Item with done status ',
                status: 'done',
                onClick: () => console.log('clicked'),
            },
            {
                content: 'Item with an action button',
                status: 'button-action',
                onClick: () => console.log('clicked'),
                button_text: 'I accept',
            },
            {
                content: 'Item with an action',
                status: 'action',
                onClick: () => console.log('clicked'),
            },
        ];
    
    return (
        <React.Fragment>
            <div className={'checkbox__wrapper'}>
                <Checklist items={list} />
            </div>
        </React.Fragment>
    )
}
```
