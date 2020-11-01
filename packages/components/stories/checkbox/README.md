# CheckBox Component

Renders a `CheckBox` component.


#### Supported Gestures:

-   Click
-   keyDown (Space and Enter)

#### Supported Events:

-   onChange

## Usage

```jsx
import Checkbox from 'Components/checkbox';

const DummyComponent = props => (
  <Checkbox
        name='test_checkbox'
        value={selected}
        onChange={() => setSelected(!selected)}
        label={('This is a test checkbox')}
    />
);
```

## Props

| Name               | Type         | Default     | Description                                        |
| ------------------ | ------------ | ----------- | -------------------------------------------------- |
| lable              | {string}     | null        | Lable of the Checkbox                              |
| name               | {string}     | null        | Name of the Checkbox                               |
| value              | {boolean}    | `false`     | Default value of the Checkbox                      |
| onChange           | {function}   | undefined   | Function returns the changed value of Checkbox     |
| classNameLabel     | {string}     | null        | The classname for the Checkbox                     |
| disabled           | {boolean}    | `false`     | Define whether the Checkbox is disable or not      |
| id                 | {string}     | null        | `id` of the Checkbox                               |
| withTabIndex       | {string}     | null        | Tabindex of the `span` element of the Checkbox     |


# Full example:

```jsx
import React, { useState } from 'react';
import Checkbox from 'Components/checkbox';

const DummyComponent = props => {

    const [selected, setSelected] = useState(false)
    
    return (
        <React.Fragment>
           <div className={'checkbox__wrapper'}>
                <Checkbox
                    name='test_checkbox'
                    value={selected}
                    onChange={() => setSelected(!selected)}
                    label={('This is a test checkbox')}
                />
            </div>
        </React.Fragment>
    )
}
```
