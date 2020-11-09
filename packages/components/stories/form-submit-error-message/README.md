# FormSubmitErrorMessage Component

Renders a `FormSubmitErrorMessage` component.


## Usage

```jsx
import FormSubmitErrorMessage from 'Components/form-submit-error-message';

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
import FormSubmitErrorMessage from 'Components/form-submit-error-message';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <FormSubmitErrorMessage message={'This is a form  submit error message!'}  />
        </React.Fragment>
    );
}
```
