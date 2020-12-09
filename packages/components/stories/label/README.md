# Label Component

A styled label component.


## Usage

```jsx
import Label from 'deriv-components';

const DummyComponent = props => (
    <Label mode={'success'}>
        <p>This is a sample label</p>
    </Label>
);
```

## Props

| Name        | Type         | Default      | Description                                                                |
| ----------- | ------------ | ------------ | -------------------------------------------------------------------------- |
| mode        | {string}     | `'default'`  | Mode of the label. One of `'adjustment'`, `'default'`, `'success'`, `'warn'`, `'danger'`, `'info'`, `'default-invert'`, `'success-invert'`, or `'warn-invert'`        |
| size        | {string}     | `'regular'`  | Size of the label. One of `'regular'` or `'large'`                         |
| className   | {string}     | null         | `className` for the main container                                         |


# Full example:

```jsx
import React from 'react';
import Label from 'deriv-components';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <Label mode={'success'} size={'large'}>
                <p>This is a sample label</p>
            </Label>
        </React.Fragment>
    )
}
```