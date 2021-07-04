# ProgressBar component

Use this component to show a progress bar

## Usage

```jsx
import { ProgressBar } from 'deriv-components';

const DummyComponent = props => (
    <ProgressBar value={props.value} label={props.label} />
);
```

## Props

| Name           | Type       | Default | Description                                           |
| -------------- | ---------- | ------- | ----------------------------------------------------- |
| className      | {string}   | `''`  | additional custom class name for progress bar         |
| danger_limit   | {float}    | `0.2`   | threshold value before the danger style takes effect  |
| label          | {string}   | `''`    | text label in the progress bar                        |
| value          | {float}    | `0`     | progress bar value                                    |
| warning_limit  | {float}    | `0.5`   | threshold value before the warning style takes effect |

## Full example:

```jsx
import { ProgressBar } from 'deriv-components';

const DummyComponent = props => (
    <ProgressBar
        className='custom-class'
        danger_limit={0.2}
        label='Progress Label'
        value={0.5}
        warning_limit={0.5}
    />
);
```
