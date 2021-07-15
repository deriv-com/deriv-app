# TickPicker Component

Component for tick selection

## Usage

```jsx
import TickPicker from 'deriv-components';

const DummyComponent = props => (
        <TickPicker default_value={props.value}/>
);
```

## Props

| Name          | Type       | Default | Description                                       |
| ---------------------| ---------- | ------- | ------------------------------------------ |
| default_value        | {number}   | `null`  | Default value of tick picker               |
| is\_submit\_disabled | {boolean}  | `false` | Disallow submissions                       |
| min_value            | {number}   | `null`  | Minimum value allowed                      |
| max_value            | {number}   | `null`  | Maximum value allowed                      |
| onSubmit             | {function} | `null`  | Callback function when submitted           |
| submit_label         | {string}   | `''`    | Label of submit buttton                    |
| singular_label       | {string}   | `''`    | Unit label in singular form                |
| plural_label         | {string}   | `''`    | Unit label in plural form                  |
| onValueChange        | {function} | `null`  | Callback function when tick value has changed|

# Full example:

```jsx
import Toast from 'deriv-components';

const DummyComponent = props => (
    <TickPicker 
        default_value={1)} 
        is_submit_disabled={false}
        min_value={1}
        max_value={10}
        onSubmit={() => console.log('Submitted!')} 
        submit_label="Go"
        singular_label="Tick"
        plural_label="Ticks"
        onValueChange={e => console.log(`New value: ${e}`)}
        />
);
```
