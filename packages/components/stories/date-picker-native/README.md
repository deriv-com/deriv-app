# Native Date Picker component
The native date picker component is a fluid element, and it fills it's parent workspace.
We use this component on mobile to have a native datepicker.

#### Supported events:
- onBlur
- onFocus
- onSelect

## Usage
 
```jsx
import { DatePickerNative } from 'deriv-components';

const DummyComponent = (props) => (
    <DatePickerNative
        id='date-picker-native'
        display_format='DD MMM YYYY'
        label='Birthday'
        onSelect={props.onSelect}
        placeholder='Birthday'
        value={props.value}
    />
)
```

## Props

| Name             | Type                   | Default       | Description                                                                                                              |
|------------------|------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------|
| id               | {string}               | null          |                                                                                                                          |
| disabled         | {boolean}              | false         |                                                                                                                          |
| display_format   | {string}               | 'DD MMM YYYY' | Date format for displaying in input                                                                                      |
| name             | {string}               | null          | Name of the field                                                                                                        |
| error            | {string}               | null          | If any text is set for this prop, select compenent will get error styles and show this text as error message             |
| label            | {string}               | null          |                                                                                                                          |
| max_date         | {string}               | null          | Maximum date that is available in YYYY-MM-DD format                                                                      |
| min_date         | {string}               | true          | Minimum date that is available in YYYY-MM-DD format                                                                      |
| placeholder      | {string}               | null          |                                                                                                                          |
| onBlur           | {function}             | null          |                                                                                                                          |
| onFocus          | {function}             | null          |                                                                                                                          |
| onSelect         | {function}             | null          | Will execute on date select                                                                                              |
| value            | {string}               | null          | Selected date in YYYY-MM-DD format                                                                                       |


## Full example:

```jsx
import { SelectNative } from 'deriv-components';

const DummyComponent = (props) => (
    <DatePickerNative
        id='date-picker-native'
        display_format='DD MMM YYYY'
        label='Birthday'
        max_date="2020-10-21"
        min_date="2020-10-18"
        onSelect={props.onSelect}
        placeholder='Birthday'
        value={props.value}
    />
)
```
