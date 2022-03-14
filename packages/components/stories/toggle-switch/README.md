# ToggleSwitch component

Use this component to show a toggle switch field

#### Supported Events

- handleToggle

## Usage

```jsx
import { ToggleSwitch } from 'deriv-components';

const DummyComponent = props => (
    <ToggleSwitch
        id='toggle-switch-story'
        is_enabled={props.is_enabled}
        handleToggle={props.handleToggle}
    />
);
```




## Props

| Name              | Type       | Default | Description                                                |
| ------------------| ---------- | ------- | -----------------------------------------------------------|
| className         | {string}   | `''`    | additional custom class name for the toggle switch element |
| classNameButton   | {string}   | `''`    | additional custom class name for the toggle switch button  |
| classNameLabel    | {string}   | `''`    | additional custom class name for the toggle switch label   |
| handleToggle      | {function} | `null`  | callback function when toggle is triggered                 |    
| id                | {string}   | `''`    | id for the toggle switch element                           |
| is_enabled        | {boolean}  | `false` | current toggle switch status                               |



## Full example:

```jsx
import { ToggleSwitch } from 'deriv-components';

const DummyComponent = () => (
     <ToggleSwitch
        className='custom-class'
        classNameButton='custom-btn-class'
        classNameLabel='custom-label-class'
        handleToggle={() => console.log('Toggle is triggered!')}
        id='custom-id'
        is_enabled={false}
    />
);
```
