# MultiStep component
Use this component to render separate steps.

## Usage
 
```jsx
import { MultiStep } from 'deriv-components';

const DummyComponent = (props) => (
     <MultiStep
        ref={this.multi_step_ref}
        lbl_previous='Back'
        steps={props.steps}
    />
);
```

## Props

| Name                     | Type                   | Default            | Description                                                                                                              |
|--------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| lbl_previous             | {string}               | null               | Prev step button's text                                                                                                  |
| steps                    | {array}                | null               | Pass steps's contents as an array                                                                                        |


## Full example:

```jsx
import { MultiStep, Button } from 'deriv-components';

const DummyComponent = (props) => (
    <MultiStep
        ref={this.multi_step_ref}
        lbl_previous='Back'
        steps={props.steps}
    />
    <Button
        onClick={() => this.multi_step_ref.current.nextStep())}
        text='Next step'
    />
);
```