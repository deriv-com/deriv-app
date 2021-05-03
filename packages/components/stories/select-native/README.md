# Select Native component
The native dropdown component is a fluid element, and it fills it's parent workspace.
We use this component on mobile to have a native select.

#### Supported events:
- onChange
- And all events that is supported on "select" tag

## Usage
 
```jsx
import { SelectNative } from 'deriv-components';

const DummyComponent = (props) => (
    <SelectNative
        placeholder='Please select'
        name='dropdown'
        label='Dropdown Label'
        list_items={props.items}
        value={props.value}
        onChange={props.onChange}
    />
)
```

## Props

| Name                        | Type                   | Default | Description                                                                                                              |
|-----------------------------|------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
| className                   | {string}               | null    |                                                                                                                          |
| classNameDisplay            | {string}               | null    | Class name for selected value text                                                                                       |
| list_items                  | {array}                | null    | Select options                                                                                                           |
| value                       | {string}               | null    | Current value                                                                                                            |
| use_text                    | {boolean}              | null    | If is true on selecting an option, it's text is set as input value otherwise option's value is set on input.              |
| label                       | {string}               | null    | Label of the field                                                                                                       |
| placeholder                 | {string}               | null    | If 'should\_show\_empty\_option' is true this prop will show as an empty option                                          |
| onChange                    | {function}             | null    | This function will be executed when an option is selected                                                                |
| should\_show\_empty\_option | {boolean}              | true    | To hide empty value options, set this prop to false                                                                      |
| hint                        | {string}               | null    | Helper text on bottom of the select box                                                                                  |
| error                       | {string}               | null    | If any text is set for this prop, select compenent will get error styles and show this text as error message             |
| disabled                    | {boolean}              | null    |                                                                                                                          |


## Full example:

```jsx
import { SelectNative } from 'deriv-components';

const DummyComponent = (props) => (
    <SelectNative
        className='my-select-class'
        classNameDisplay='selected-value-class'
        placeholder='Please select'
        name='dropdown'
        label='Dropdown Label'
        list_items={props.items}
        value={props.value}
        onChange={props.onChange}
        should_show_empty_option={false}
        hint='Please choose one option'
    />
)
```
