# FormSubmitErrorMessage Component

A styles error message for forms.


## Usage

```jsx
import FormSubmitErrorMessage from 'deriv-components';

const DummyComponent = props => (
    <FormSubmitErrorMessage message={'This is a form  submit error message!'}  />
);
```

## Props


| Name          | Type       | Default  | Description                   |
| ------------- | ---------- | -------- | ----------------------------- |
| message       | {string}   | null     | The error message             |


# Full example:

```jsx
import React from 'react';
import FormSubmitErrorMessage from 'deriv-components';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <FormSubmitErrorMessage message={'This is a form  submit error message!'}  />
        </React.Fragment>
    );
}
```
