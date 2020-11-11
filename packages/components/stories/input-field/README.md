# InputField Component

A custom `InputField` component.


#### Supported Gestures:

-   Click

#### Supported Events:

-   onChange


## Usage

```jsx
import InputField from 'deriv-components';

const DummyComponent = props => (
    <InputField 
        type='text'
        value={value}
        onChange={onChangeText}
        placeholder={'placeHolder'}
    />
);
```

## Props


| Name                          | Type       | Default  | Description                                                       |
| ----------------------------- | ---------- | -------- | ----------------------------------------------------------------- |
| label                         | {string}   | null     | The label of the InputField                                       |
| ariaLabel                     | {string}   | null     | The aria label of the InputField                                  |
| type                          | {string}   | null     | The type of the input. Can be `text`, `checkbox`, `number`, ...   |
| value                         | {string}   | null     | The value of the InputField                                       |
| checked                       | {boolean}  | null     | Initial value if the input type is `checkbox`                     |
| currency                      | {string}   | null     | The currency value                                                |
| current_focus                 | {string}   | null     | The current focus element                                         |
| data_tip                      | {string}   | null     | The data-tip                                                      |
| data_value                    | {string}   | null     | The data-value                                                    |
| error_messages                | [string]   | null     | The error message list                                            |
| error\_message\_alignment     | {string}   | `left`   | The error message alaignment                                      |
| fractional_digits             | {string}   | null     | The fractional digits                                             |
| helper                        | {string}   | null     | Help text shows on the top of the InputField                      |
| onClick                       | {function} | null     | Function triggers when the user clicks on InputField              |
| onChange                      | {function} | null     | Function triggers when the value changes                          |
| onClickInputWrapper           | {string}   | null     | Function triggers when the user clicks on InputField wrapper      |
| id                            | {string}   | null     | `id` for the InputField                                           |
| inline_prefix                 | {string}   | null     | The inline prefix item                                            |
| is\_autocomplete\_disabled    | {string}   | null     | Defines whether the autocomplete is disabled or not                |
| is_disabled                   | {boolean}  | null     | Defines the disability of the input                               |
| is\_error\_tooltip\_hidden    | {string}   | `false`  | Defines whether the error tooltip os hidden or not                |
| is_float                      | {string}   | null     | Defines whether the value can be float number or not              |
| is\_hj\_whitelisted           | {string}   | `false`  | Defines whether the value is in whitelist for hotjar or not       |
| is_incrementable              | {boolean}  | null     | Defines whether show the increment and decrement buttons or not   |
| is\_incrementable\_on\_long\_press| {boolean}| null   | Allow increment on long press                                     |
| is\_negative\_disabled        | {boolean}  | null     | Prevent the value to be a negative number                         |
| is\_read\_only                | {boolean}  | `false`  | Prevent user to edit the value                                    |
| is_signed                     | {boolean}  | `false`  | Defines whether the value can be negative number                  |
| is\_unit\_at\_right           | {boolean}  | `false`  | Set the position of unit                                          |
| unit                          | {string}   | null     | Unit of the value                                                 |
| inputmode                     | {string}   | null     | The input mode                                                    |
| label                         | {string}   | null     | The label of the InputField                                       |
| max_length                    | {number}   | null     | The maximum length of the value                                   |
| max_value                     | {number}   | null     | The maximum acceptable value                                      |
| min_value                     | {number}   | null     | The minimum acceptable value                                      |
| name                          | {string}   | null     | The name of the InputField                                        |
| format                        | {function} | null     | Function to format the inputted value                             |
| prefix                        | {string}   | null     | The prefix for the InputField                                     |
| required                      | {boolean}  | null     | Defines whether the value is required or not                      |
| setCurrentFocus               | {function} | null     | Function to set current focus                                     |
| className                     | {string}   | null     | `className` for the main container                                |
| classNameInlinePrefix         | {string}   | null     | `className` for the inline prefix                                 |
| classNameInput                | {string}   | null     | `className` for the input                                         |
| classNamePrefix               | {string}   | null     | `className` for the prefix                                        |



# Full example:

```jsx
import React from 'react';
import InputField from 'deriv-components';

const DummyComponent = props => {
    
    const [value, setValue] = React.useState('')
    const onChangeText = (e) => setValue(e.target.value) 

    return (
        <React.Fragment>
            <InputField 
                type='number'
                is_incrementable
                is_incrementable_on_long_press
                is_negative_disabled
                value={value}
                onChange={onChangeText}
                unit={'kg'}
                is_unit_at_right
                label={'Number field with unit'}
                placeholder={'Weight'}
            />
        </React.Fragment>
    );
}
```
