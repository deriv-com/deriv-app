# Mobile Dialog Component

Renders a dialog box with title, body and footer for mobile and desktop. This component uses an empty `div` with a spesific `id` as portal to render the dialog. So, add somtehing like `<div id='modal_root'/>` to your  `index.html` file.

#### Supported Gestures:

-   Click

## Usage

```jsx
import MobileDialog from 'deriv-components';

const DummyComponent = props => (
   <MobileDialog
        portal_element_id='modal_root'
        title={'This is the title of dialog'}
        visible={is_visible}
        has_content_scroll
        onClose={() => set_is_visible(!is_visible)}
        footer={<p>This is the footer of dialog</p>}
        wrapper_classname={'wrapper'}
    >
            <p>This is the main part of dialog</p>
    </MobileDialog>
);
```

## Props

| Name                          | Type         | Default   | Description                                            |
| ----------------------------- | ------------ | --------- | ------------------------------------------------------ |
| portal\_element\_id `*required` | {string}   | null      | Id of the portal element                               |
| children                      | {react node} | null      | Dialog inner elements.                                 |
| visible                       | {boolean}    | null      | controls visability of dialog                          |
| title                         | {string}     | null      | Title of the dialog                                    |
| renderTitle                   | {function}   | null      | A function returns a React Node for more complex title |
| wrapper_classname             | {string}     | null      | ClassName for dialog inner elements (children)         |
| onClose                       | {function}   | undefined | Function triggers when the user clicks on close button |
| has\_content\_scroll          | {boolean}    | null      | Defines whether the dialog is scrollable or not        |
| content\_height\_offset       | {string}     | 8px       | Dialog height offset                                   |


# Full example:

```jsx
import MobileDialog from 'deriv-components';

const DummyComponent = props => (
   <MobileDialog
        portal_element_id='modal_root'
        title={'This is the title of dialog'}
        visible={is_visible}
        has_content_scroll
        onClose={() => set_is_visible(!is_visible)}
        footer={<p>This is the footer of dialog</p>}
        wrapper_classname={'wrapper'}
    >
            <p>This is the main part of dialog</p>
    </MobileDialog>
);
```
