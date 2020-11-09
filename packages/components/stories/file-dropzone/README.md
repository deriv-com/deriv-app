# Field Component

Renders a `Field` component which is a text with normal, error, or warn style.


## Usage

```jsx
import Field from 'Components/field';

const DummyComponent = props => (
    <Field message={'This is an error Field'} type={'error'} />
);
```

## Props


| Name          | Type         | Default     | Description                                                          |
| ------------- | ------------ | ----------- | -------------------------------------------------------------------- |
| message       | {string}     | null        | The main text of Field                                               |
| type          | {string}     | null        | Type of fading. One of `'error'`, `'warn'` or null for normal field  |
| className     | {string}     | null        | classname for the wrapper                                            |



# Full example:

```jsx
import React, { useState } from 'react';
import Field from 'Components/field';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <Field message={'This is an error Field'} type={'error'} />
        </React.Fragment>
    );
}
```
