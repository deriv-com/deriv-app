# FormSubmitButton Component

A submit button and optionally a back button for forms.


## Usage

```jsx
import FormSubmitButton from 'deriv-components';

const DummyComponent = props => (
    <FormSubmitButton
        is_disabled={false}
        label={'Submit'}
        has_cancel
        cancel_label={'Back'}
        onCancel={() => { }}
        onClick={() => { }} />
);
```

## Props


| Name          | Type       | Default  | Description                                                   |
| ------------- | ---------- | -------- | ------------------------------------------------------------- |
| label         | {string}   | null     | Label for the main button                                     |
| cancel_label  | {string}   | null     | Label for the cancel button                                   |
| has_cancel    | {boolean}  | `false`  | Defines the visibility of the cancel button                    |
| onClick       | {function} | null     | Function triggers when the user clicks on the main button     |
| onCancel      | {function} | null     | Function triggers when the user clicks on the cancel button   |
| is_absolute   | {boolean}  | `false`  | Set absolute position for buttons to right down of the form   |
| is_center     | {boolean}  | `false`  | Set the position of buttons to bottom center of the form      |
| is_disabled   | {boolean}  | `false`  | Defines the disability of the buttons                           |
| form_error    | {string}   | `''`     | The form error text                                           |
| className     | {string}   | null     | `className` for the main container                            |



# Full example:

```jsx
import React from 'react';
import FormSubmitButton from 'deriv-components';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <FormSubmitButton
                is_disabled={false}
                label={'Submit'}
                has_cancel
                cancel_label={'Back'}
                onCancel={() => { }}
                onClick={() => { }} />
        </React.Fragment>
    );
}
```
