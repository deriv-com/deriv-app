# Modal Component

A custom modal component.


#### Usage

```jsx
import Modal from'deriv-components';

const DummyComponent = props => (
    <Modal
        title={'Modal Title'}
        is_open={visibility}
        toggleModal={toggleVisibility}
    >
        <Modal.Body>
            <p>This is the modal body</p>
        </Modal.Body>
        <Modal.Footer has_separator>
            <p>This is the modal footer</p>
        </Modal.Footer>
    </Modal>
);
```

#### Props


| Name                    | Type                   | Default       | Description                                                               |
| ----------------------- | ---------------------- | ------------- | ------------------------------------------------------------------------- |
| id                      | {string}               | null          | `id` for the modal                                                        |
| has\_close\_icon        | {boolean}              | `true`        | Defines whether the modal has close icon or not                           |
| header                  | {string}               | null          | Header for the modal                                                      |
| height                  | {string}               | null          | Height of the modal                                                       |
| width                   | {string}               | null          | Width of the modal                                                        |
| is_open                 | {boolean}              | null          | Defines the visibility of the modal                                       |
| is\_confirmation\_modal | {boolean}              | null          | Defines whether the modal is a confirmation modal                         |
| is\_vertical\_bottom    | {boolean}              | null          | Set the modal vertical position to bottom                                 |
| is\_vertical\_centered  | {boolean}              | null          | Set the modal vertical position to center                                 |
| is\_vertical\_top       | {boolean}              | null          | Set the modal vertical position to top                                    |
| is\_title\_centered     | {boolean}              | null          | Set the modal title position to center                                    |
| onEntered               | {function}             | null          | Function triggers when the modal opened                                  |
| onExited                | {function}             | null          | Function triggers when the modal closed                                  |
| onMount                 | {function}             | null          | Function triggers when the modal mounted                                 |
| onUnmount               | {function}             | null          | Function triggers when the modal unmounted                               |
| portalId                | {string}               | `'modal_root'`| Portal id to render the modal                                             |
| renderTitle             | {function}             | null          | Function to render the modal title                                         |
| small                   | {boolean}              | null          | Defines whether the modal is small or not                                 |
| title                   | {string \| react node} | null          | The modal title                                                           |
| toggleModal             | {function}             | null          | Toggle the visibility of the modal                                        |
| elements\_to\_ignore    | [string]               | null          | List of element ids to ignore when user clicks outside to close the modal |
| className               | {string}               | null          | `className` for the main container                                        |

---

## Modal.Body


Renders a body for `Modal` component. `Modal.Body` just add a wrapper with some styles to it's childrens.


---

## Modal.Footer


Renders a footer for `Modal` component.


#### Props


| Name           | Type       | Default  | Description                                             |
| -------------- | ---------- | -------- | ------------------------------------------------------- |
| has_separator  | {boolean}  | null     | Defines whether render a separator or not               |
| is_bypassed    | {boolean}  | null     | Defines whether the footer must be bypassed or not      |


# Full example:

```jsx
import React from 'react';
import Modal from 'deriv-components';
import Button from 'deriv-components';

const DummyComponent = props => {
    const [visibility, setVisibility] = React.useState(false)
    const toggleVisibility = () => setVisibility(!visibility)

    return (
        <React.Fragment>
            <Button onClick={toggleVisibility} text={'Click Me!'} primary medium />
            <div id='modal_root' />
            <Modal
                title={'Modal Title'}
                is_open={visibility}
                toggleModal={toggleVisibility}
            >
                <Modal.Body>
                    <p>This is the modal body</p>
                </Modal.Body>
                <Modal.Footer has_separator>
                    <p style={{color: 'var(--text-prominent)'}}>This is the modal footer</p>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}
```
