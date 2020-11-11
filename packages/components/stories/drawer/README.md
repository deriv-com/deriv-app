# Drawer Component

A menu appears in the right side of the screen for desktop view and in the bottom of the screen for mobile view.


#### Supported Gestures:

-   Click

## Usage

```jsx
import Drawer from 'deriv-components';

const DummyComponent = props => (
    <Drawer
        is_open={visibility}
        toggleDrawer={toggleVisibility}
        zIndex={1}
    >
        <p>This is the content of drawer</p>
    </Drawer>
);
```

## Props

| Name                     | Type         | Default     | Description                                                   |
| ------------------------ | ------------ | ----------- | ------------------------------------------------------------- |
| is_open                  | {boolean}    | null        | Define whether the draert is open or close                    |
| toggleDrawer             | {function}   | null        | Function controls the visibility of the drawer                |
| is_mobile                | {boolean}    | null        | Define whether the user uses mobile or not                    |
| header                   | {react node} | null        | Header element of the drawer                                  |
| footer                   | {react node} | null        | Footer element of the drawer                                  |
| className                | {string}     | null        | classname for the main drawer component                       |
| contentClassName         | {string}     | null        | classname for the children elements of the drawer             |
| clear\_stat\_button_text | {string}     | null        | Inner text for the clear stat button                          |
| onClearStatClick         | {function}   | null        | Function triggers when user clicks on the clear stat button   |
| is\_clear\_stat\_disabled| {boolean}    | null        | Define whether the clear stat button is disable or not        |


# Full example:

```jsx
import React, { useState } from 'react';
import Drawer from 'deriv-components';

const DummyComponent = props => {

    const [visibility, setVisibility] = useState(false);
    const toggleVisibility = () => setVisibility(!visibility);
    
    return (
        <React.Fragment>
            <Drawer
                clear_stat_button_text={'Reset'}
                is_clear_stat_disabled={false}
                is_mobile={boolean('isMobile', false)}
                is_open={visibility}
                onClearStatClick={() => { }}
                toggleDrawer={toggleVisibility}
                footer={<p>This is Footer</p>}
                zIndex={1}
            >
                <p>This is the content of drawer</p>
            </Drawer>
        </React.Fragment>
    )
}
```
