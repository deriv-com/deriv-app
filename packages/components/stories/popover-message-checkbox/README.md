# PopoverMessageCheckbox component
Use this component as Popover component's message prop.

#### Supported events:
- onChange

## Usage
 
```jsx
import { PopoverMessageCheckbox } from 'deriv-components';

const DummyComponent = (props) => (
    <PopoverMessageCheckbox 
        onChange={props.toggleCkeck} 
        defaultChecked={props.is_checked}
    />
);
```

## Props

| Name                     | Type                   | Default            | Description                                                                                                              |
|--------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| onChange                 | {function}             | null               | Callback function for checkbox's onChange event                                                                          |
| checkboxLabel            | {string}               | null               |                                                                                                                          |
| defaultChecked           | {boolean}              | null               | If is 'true' ckeckbox is checked                                                                                         |
| message                  | {string}               | null               | Checkbox's description                                                                                                   |
| name                     | {string}               | null               | Name of the checkbox's inp                                                                                               |


## Full example:

```jsx
import { Popover, PopoverMessageCheckbox } from 'deriv-components';

const DummyComponent = (props) => (
    <Popover
        message={
            <PopoverMessageCheckbox 
                onChange={props.toggleCkeck} 
                defaultChecked={props.is_checked}
                checkboxLabel='Disable a tool' 
                message='Check the box please' 
            />
        }
    >
        <div>Hover me to see the message</div>
    </Popover>
);
```