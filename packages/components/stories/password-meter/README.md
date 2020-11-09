# PasswordMeter component
To check strength of a password use this component and wrap the 'PasswordInput' component with it.

## Usage
 
```jsx
import { PasswordMeter, PasswordInput } from 'deriv-components';

const DummyComponent = (props) => (
    <PasswordMeter input={props.new_password}>
        <PasswordInput
            label='New password'
            onChange={props.updateNewPassword}
        />
    </PasswordMeter>
);
```

## Props

| Name                     | Type                   | Default            | Description                                                                                                              |
|--------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| input                    | {string \| number}     | null               | User's password                                                                                                          |
| has_error                | {boolean}              | null               | If wrapped component has an error set this to 'true' to remove warning text                                              |


## Full example:

```jsx
import { PasswordMeter, PasswordInput } from 'deriv-components';

const DummyComponent = (props) => (
    <PasswordMeter has_error={props.has_error} input={props.new_password}>
        <PasswordInput
            label='New password'
            error={props.has_error}
            onChange={props.updateNewPassword}
        />
    </PasswordMeter>
);
```