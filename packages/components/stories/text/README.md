# Text component

Use this component to show a text

## Usage

```jsx
import { Text } from 'deriv-components';

const DummyComponent = props => (
    <Text size={props.size} />
);
```

## Props

| Name           | Type       | Default  | Options                                                    | Description                          |
| -------------- | ---------- | -------  | -----------------------------------------------------------|--------------------------------------|
| align          | {string}   | `left`   | `left` `center` `right`                                    | alignment of the text                |
| as             | {string}   | `span`   | `DOM element`                                              | render as specific DOM element       |
| className      | {string}   | `''`     |                                                            | custom class for the text component  | 
| color          | {string}   | `general`| `general` `less-prominent` `prominent` `disabled` <br /> `loss-danger` `profit-success` `warning` `red` `blue` `colored-background`  |  color of the text   |
| size           | {string}   | `s`      | `xxxxs` `xxxs` `xxs` `xs` `s` <br /> `xsm` `sm` `m` `l` `xl` `xxl`| size of the text              |
| weight         | {string}   | `normal` | `lighter` `normal` `bold` `bolder`                         | weight of the text                   |
| line_height    | {string}   | `m`      | `xxs` `s` `m` `l` `xl` `xxl`                               | text line height                     |
| styles         | {object}   | `null`   |                                                            | additional text styles               |


## Full example:

```jsx
import { Text` } from 'deriv-components';

const DummyComponent = () => (
    <Text
        className='custom-class'
        size='xl'
        color='prominent'
        align='center'
        weight='bolder' 
        line_height='m'
        as='p'
        styles={
            '--text-align': 'var(--text-align-left)',
        }
        >Hello Deriv</Text>
        }
    />
);
```
