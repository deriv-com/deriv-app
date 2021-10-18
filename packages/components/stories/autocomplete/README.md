# AutoComplete Component

A searchable `Dropdown` input component that accepts text input and provides a suggested list based on keyword entered.


#### Supported Events:

-   onChange
-   Arrow keypresses for movement
-   Enter keypresses for selection


## Usage

```jsx
import Autocomplete from 'deriv-components';

const DummyComponent = props => (
    <Autocomplete
        type='text'
        label={'Place of birth'}
        list_items={data}
        onItemSelection={({ value, text }) => {
            setFieldValue('citizen', value ? text : '',)
        }}
        required
    />
);
```

## Props

| Name               | Type                             | Default             | Description                               |
| ------------------ | -------------------------------- | ------------------- | ----------------------------------------- |
| list_items         | [string] \| [object<text,value>] | []                  | Suggestion list                           |
| list_height        | {string}                         | null                | Height of the suggestion list element.    |
| not\_found\_text   | {string}                         | 'No results found'  | Text to show if no item found             |
| onHideDropdownList | {function}                       | undefined           | Function triggers when the dropdown hides.|
| onItemSelection    | {function}                       | undefined           | Function returns the selected element.    |


# Full example:

```jsx
import { Formik, Field } from 'formik';
import Autocomplete from 'deriv-components';

const DummyComponent = props => (
    <React.Fragment>
        <div className={'autocomplete__wrapper'}>
            <Formik initialValues={{ citizen: '' }}>
                {({ setFieldValue }) => (
                    <Field name='citizen'>
                        {({ field }) => (
                            <Autocomplete
                                {...field}
                                type='text'
                                label={'Place of birth'}
                                list_items={[
                                    { text: 'Malaysia', value: 'ML' },
                                            { text: 'China', value: 'CH' },
                                            { text: 'USA', value: 'US' },
                                            { text: 'Canada', value: 'CA' },
                                            { text: 'Sweden', value: 'SE' },
                                            { text: 'Norway', value: 'NO' },
                                ]}
                                onItemSelection={({ value, text }) => {
                                    setFieldValue('citizen', value ? text : '',)
                                }}
                                required
                            />
                        )}
                    </Field>
                )}
            </Formik>
        </div>
    </React.Fragment>
);
```
