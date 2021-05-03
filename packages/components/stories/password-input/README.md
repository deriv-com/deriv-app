# PasswordInput component

This component is used to have a password type input.

#### Supported events:

All events supported by an '\<input>' tag.

## Usage

```jsx
import { PasswordInput } from 'deriv-components';

const DummyComponent = props => <PasswordInput autoComplete='new-password' label='New password' name='new_password' />;
```

## Props

| Name  | Type      | Default | Description                                                         |
| ----- | --------- | ------- | ------------------------------------------------------------------- |
| label | {string}  | null    |                                                                     |
| name  | {string}  | null    |                                                                     |
| error | {boolean} | null    | If component has an error set this to 'true' to enable error styles |

## Full example:

```jsx
import { PasswordInput } from 'deriv-components';

const DummyComponent = props => (
    <PasswordInput
        autoComplete='new-password'
        label='New password'
        name='new_password'
        error={props.has_error}
        onChange={props.onChange}
    />
);
```
