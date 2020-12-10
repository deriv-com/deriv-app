# Dialog Component

A dialog with Confirm and Cancel buttons.


#### Supported Gestures:

-   Click

#### Supported Events:

-   onCancel
-   onConfirm

## Usage

```jsx
import Dialog from 'deriv-components';

const DummyComponent = props => (
    <Dialog
        is_visible={visibility}
        title={'title'}
        has_close_icon
        cancel_button_text={'Cancel'}
        confirm_button_text={'Confirm'}
        onCancel={()=>{console.log('Canceled')}}
        onConfirm={()=>{console.log('Confirmed')}}
    >
        <p>This is the main part of the Modal</p>
    </Dialog>
);
```

## Props

| Name                  | Type        | Default     | Description                                               |
| --------------------- | ----------- | ----------- | --------------------------------------------------------- |
| is_visible            | {boolean}   | null        | Define the visibility of modal                            |
| title                 | {string}    | null        | Title of the modal                                        |
| portal\_element\_id   | {string}    | null        | Portal element id for render modal                        |
| confirm\_button\_text | {string}    | null        | Inner text of the confirm button                          |
| cancel\_button\_text  | {string}    | null        | Inner text of the cancel button                           |
| onCancel              | {function}  | null        | Function triggers when user clicks on cancel button       |
| onConfirm             | {function}  | null        | Function triggers when user clicks on confirm button      |
| disableApp            | {function}  | null        | Function for disable app                                  |
| enableApp             | {function}  | null        | Function for enable app                                   |
| is\_closed\_on\_cancel| {boolean}   | `'true'`    | Define whether the modal should close on cancel or not    |
| is\_closed\_on\_confirm| {boolean}  | `'true'`    | Define whether the modal should close on confirm or not   |
| is_loading            | {boolean}   | null        | Define the loading state of modal                         |


# Full example:

```jsx
import React, { useState } from 'react';
import Dialog from 'deriv-components';
import Button from 'deriv-components';

const DummyComponent = props => {
    const [visibility, setVisibility] = useState(false)
    const toggleVisibility = () => setVisibility(!visibility)

    return (
        <React.Fragment>
            <Button onClick={toggleVisibility} text={'Click Me!'} primary medium />
            <div className={'dialog__wrapper'}>
                <Dialog
                    is_visible={visibility}
                    title={'title'}
                    is_mobile_full_width={false}
                    has_close_icon
                    cancel_button_text={'Cancel'}
                    confirm_button_text={'Confirm'}
                    onCancel={()=>{console.log('Canceled')}}
                    onConfirm={()=>{console.log('Confirmed')}}
                >
                    <p>This is the main part of the Modal</p>
                </Dialog>
            </div>
        </React.Fragment>
    );
}
```
