# RemainingTime component
This component is used to get duration between two different times.

## Usage
 
```jsx
import { RemainingTime } from 'deriv-components';

const DummyComponent = (props) => (
    <RemainingTime 
        start_time={props.start_time} 
        end_time={props.end_time} 
        getCardLabels={props.getCardLabels}
    />
);
```

## Props

| Name                     | Type                | Default            | Description                                                                                                              |
|--------------------------|---------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| start_time               | {object} moment     | null               | Start time in moment object format                                                                                        |
| end_time                 | {number \| string}  | null               | Timestamp of the end time                                                                                                |
| getCardLabels            | {function}          | null               | getCardLabels localization function                                                                                      |
