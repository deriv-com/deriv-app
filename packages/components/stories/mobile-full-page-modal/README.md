# MobileFullPageModal Component

A full screen modal for mobile view.


## Usage

```jsx
import MobileFullPageModal from 'deriv-components';

const DummyComponent = props => (
    <MobileFullPageModal
        is_modal_open={visibility}
        header={'This is the header'}
        onClickClose={toogleVisibility}
    >
        <p>This is the content</p>
    </MobileFullPageModal>
);
```

## Props


| Name            | Type        | Default     | Description                                             |
| --------------- | ----------- | ----------- | ------------------------------------------------------- |
| header          | {string}    | null        | The header text                                         |
| is\_modal\_open | {boolean}   | null        | Defines the visibility of the modal                     |
| onClickClose    | {function}  | null        | Function triggers when the user clicks on close button  |
| height_offset   | {string}    | `0px`       | Modal height offset                                     |
| className       | {string}    | null        | `className` for the main container                      |


# Full example:

```jsx
import React from 'react';
import MobileFullPageModal from 'deriv-components';

const DummyComponent = props => {
    
    const [visibility, setVisibility] = React.useState(false)
    const toogleVisibility = () => setVisibility(!visibility)

    return (
        <React.Fragment>
            <Button onClick={toogleVisibility} text={'Click Me!'} primary medium />
            <MobileFullPageModal
                is_modal_open={visibility}
                header={'This is the header'}
                onClickClose={toogleVisibility}
            >
                <div style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', display: 'flex' }}>
                    <p style={{ textAlign: 'center' }}>This is the content</p>
                </div>
            </MobileFullPageModal>
        </React.Fragment>
    )
}
```