# RadioGroup component

Use this component to show a radio group

#### Supported Events

- onToggle

## Usage

```jsx
import { RadioGroup } from 'deriv-components';

const DummyComponent = props => (
    <RadioGroup>
        <RadioGroup.Item
            label={'Radio A'}
            value={'A'}
        />
        <RadioGroup.Item
            label={'Radio B'}
            value={'B'}
        />
    </RadioGroup>
);
```



## Radio Group Props

| Name              | Type       | Default | Description                                           |
| ------------------| ---------- | ------- | ----------------------------------------------------- |
| className         | {string}   | `''`    | additional custom class name for radio group element  |
| name              | {string}   | `''`    | radio group input name                                |
| onToggle          | {function} | `null`  | callback function when radio input change             |
| required          | {boolean}  | `false` | is radio input required                               |
| selected          | {any}      | `null`  | current selected radio input                          |
| should\_wrap\_items | {boolean}  | `false` | wrap radio items in special container               |

## Radio Group Item Props

| Name        | Type       | Default | Description                                           |
| ----------- | ---------- | ------- | ----------------------------------------------------- |
| label       | {string}   | `''`     | text label for radio input                            |
| value       | {any}      | `null`  | value of radiot input                                 |
| disabled    | {boolean}  | `false` | disable a radio input                                 |


## Full example:

```jsx
import { ProgressBar } from 'deriv-components';

const DummyComponent = () => (
    <RadioGroup 
        className={'custom-class'} 
        name={'radio-name'}
        onToggle={e => console.log(e)}
        required={false}
        selected={'A'}
        should_wrap_items={true}>
            <RadioGroup.Item
                label={'Radio A'}
                value={'A'}
            />
            <RadioGroup.Item
                label={'Radio B'}
                value={'B'}
            />
    </RadioGroup>
);
```
