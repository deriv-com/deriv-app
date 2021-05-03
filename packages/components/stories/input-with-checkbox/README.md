# InputWithCheckbox Component

An input with a checkbox. The input disability depends on the value of the checkbox.


#### Supported Gestures:

-   Click

#### Supported Events:

-   onChange

## Usage

```jsx
import InputWithCheckbox from 'deriv-components';

const DummyComponent = props => (
    <InputWithCheckbox
        name='test_checkbox'
        value={selected}
        onChange={() => setSelected(!selected)}
        label={('This is a test checkbox')}
    />
);
```

## Props

| Name                    | Type         | Default     | Description                                                                |
| ----------------------- | ------------ | ----------- | -------------------------------------------------------------------------- |
| label                   | {string}     | null        | Label of the input                                                         |
| name                    | {string}     | null        | Name of the input                                                          |
| value                   | {boolean}    | null        | Default value of the input                                                 |
| max_value               | {number}     | null        | Defines the maximum acceptable value                                       |
| onChange                | {function}   | null        | Function returns the changed value of Checkbox and input by their names    |
| addToast                | {function}   | null        | Function to add toast                                                      |
| removeToast             | {function}   | null        | Function to remove the toast                                               |
| currency                | {string}     | null        | The currency                                                               |
| defaultChecked          | {boolean}    | null        | Defines whether the checkbox is checked by default or not                  |
| error_messages          | [string]     | null        | An array of error messages                                                 |
| error\_message\_alignment| {string}    | null        | Error message alignment                                                    |
| is\_negative\_disabled  | {boolean}    | null        | Defines whether prevent the value to be negative or not                    |
| is\_single\_currency    | {boolean}    | null        | Defines whether there are single currency or not                           |
| is\_input\_hidden       | {boolean}    | null        | Defines whether the input element is hidden or not                         |
| current_focus           | {string}     | null        | Current focus                                                              |
| setCurrentFocus         | {function}   | null        | Function to set the current focus                                          |
| checkbox\_tooltip\_label| {string}     | null        | Tooltip label for the Checkbox                                             |
| tooltip_label           | {string}     | null        | Tooltip label                                                              |
| tooltip_alignment       | {string}     | null        | Tooltip alignment                                                          |
| className               | {string}     | null        | `className` for the main container                                         |
| classNameInlinePrefix   | {string}     | null        | `className` for the inline prefix                                          |
| classNameInput          | {string}     | null        | `className` for the input element                                          |
| classNamePrefix         | {string}     | null        | `className` for the prefix                                                 |


# Full example:

```jsx
import React, { useState } from 'react';
import InputWithCheckbox from 'deriv-components';

const DummyComponent = props => {

    const [value, setValue] = useState(0);
    const [selected, setSelected] = useState(false);

    const onChange = (e) => {
        if (e.target.name === "use_credit") setValue(e.target.value)
        else setSelected(e.target.value)
    }
    
    return (
        <React.Fragment>
            <InputWithCheckbox
                is_single_currency={true}
                is_negative_disabled={true}
                defaultChecked={selected}
                is_input_hidden={!selected}
                label={'Use Credit'}
                name='use_credit'
                onChange={onChange}
                value={value}
            />
        </React.Fragment>
    )
}
```
