# Input Component

A custom `Input` component.


#### Supported Events:

-   onChange


## Usage

```jsx
import Input from 'deriv-components';

const DummyComponent = props => (
    <Input 
        type='text'
        name='first_name'
        label={'First name'}
        value={value}
        onChange={onChangeText}
    />
);
```

## Props


| Name                      | Type       | Default  | Description                                           |
| ------------------------- | ---------- | -------- | ----------------------------------------------------- |
| label                     | {string}   | null     | The label of the input                                |
| hint                      | {string}   | null     | The hint text showing at the bottom of the input      |
| onChange                  | {function} | null     | Function triggers when the value has changed          |
| leading_icon              | {string}   | null     | The loading icon for the input                        |
| trailing_icon             | {string}   | null     | The trailing icon for the input                       |
| has\_character\_counter   | {string}   | null     | Defines whether to show character counter or not      |
| initial\_character\_count | {number}   | null     | The initial character count                           |
| max_characters            | {number}   | null     | Defines the maximum character count                   |
| disabled                  | {boolean}  | null     | Defines the disability of the input                   |
| error                     | {string}   | null     | The error message for the input                       |
| warn                      | {string}   | null     | The warning message for the input                     |
| className                 | {string}   | null     | `className` for the main container                    |
| classNameError            | {string}   | null     | `className` for the error field                       |
| classNameWarn             | {string}   | null     | `className` for the warning field                     |


# Full example:

```jsx
import React from 'react';
import Input from 'deriv-components';

const DummyComponent = props => {
    
    const [value, setValue] = React.useState('')
    const onChangeText = (e) => setValue(e.target.value) 

    return (
        <React.Fragment>
            <Input 
                type='text'
                name='first_name'
                label={('First name')}
                value={value}
                onChange={onChangeText}
                has_character_counter
                initial_character_count={0}
                max_characters={20}
                hint={'Please enter your first name'}
            />
        </React.Fragment>
    );
}
```
