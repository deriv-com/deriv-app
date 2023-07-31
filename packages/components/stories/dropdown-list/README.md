# DropdownList Component

A list of selectable items for a DropDown.

#### Supported Gestures:

-   Click
-   Arrow keypresses for movement
-   Space and Enter keypresses for selection

## Usage

```jsx
import DropdownList from 'deriv-components';

const DummyComponent = props => (
    <DropdownList
        dropdown_refs={{ dropdown_ref }}
        is_visible={visibility}
        list_items={items}
        onItemSelection={selectItem}
    />
);
```

## Props

| Name            | Type                              | Default | Description                                                                                                                |
| --------------- | --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| is_visible      | {boolean}                         | null    | Define the visibility of the DropdownList                                                                                  |
| list_items      | [string] \| [object<text, value>] | null    | List of the items                                                                                                          |
| onItemSelection | {function}                        | null    | Function returns the selected item                                                                                         |
| list_height     | {string}                          | `220px` | Height of the list                                                                                                         |
| active_index    | {number}                          | null    | Index of the active index                                                                                                  |
| setActiveIndex  | {function}                        | null    | Function returns the active index when it changes                                                                          |
| style           | {object}                          | null    | Style object for the main wrapper                                                                                          |
| dropdown_refs   | {object}                          | null    | `dropdown_refs` for the main DropdownList and inner elements. An object of {dropdown_ref, list_item_ref, list_wrapper_ref} |
| onScrollStop    | {function}                        | null    | Function triggers when the user stops scrolling                                                                            |
| not_found_text  | {string}                          | null    | For AutoComplete if the entered text is not found in the list of items                                                     |

# Full example:

```jsx
import React, { useState } from 'react';
import DropdownList from 'deriv-components';

const DummyComponent = props => {

    const [visibility, setVisibility] = useState(false);
    const [selected, setSelected] = useState(null);

    const toggleVisibility = () => setVisibility(!visibility);
    const selectItem = (value) => {
        setVisibility(!visibility);
        setSelected(value.value);
    }
    const dropdown_ref = React.createRef()

    const items = [
        { text: 'Apple', value: 'The apple is selected' },
        { text: 'Orange', value: 'The orange is selected' },
        { text: 'Banana', value: 'The banana is selected' },
        { text: 'Pears', value: 'The pears is selected' }
    ]

    return (
        <React.Fragment>
            <div className={'selected-item'} onClick={toggleVisibility}></div>
                {selected || 'Choose from the list'}
            </div>
            <DropdownList
                dropdown_refs={{ dropdown_ref }}
                active_index={2}
                style={{ width: '240px', marginTop:'40px' }}
                is_visible={visibility}
                list_items={items}
                onItemSelection={selectItem}
            />
        </React.Fragment>
    );
}
```
