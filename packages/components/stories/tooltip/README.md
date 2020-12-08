# Tooltip component
Shows a tooltip on mouse hover.

## Usage
 
```jsx
import { Tooltip } from 'deriv-components';

const DummyComponent = (props) => (
    <Tooltip 
        className='tooltip-storybook-wrapper'
        classNameIcon='tooltip-storybook-icon'
        alignment='right'
        message='Information about the item.'
    >
        <span>Hover me to see a tooltip.</span>
    </Tooltip>
)
```

## Props

| Name             | Type                   | Default            | Description                                                                                                              |
|------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| className        | {string}               | null               | Tooltip's wrapper class                                                                                                  |
| classNameIcon    | {string}               | null               | Tooltip's icon class                                                                                                     |
| alignment        | {string}               | null               | Use this to choose placement of the tooltip. It can be top, right, bottom or left.                                       |
| message          | {string}               | null               | It's the info message you want to show on tooltip.                                                                               |
| icon             | {string}               | null               | If want to have an icon for your text you can set one of 'info' or 'question' in this prop.                              |
| has\_error       | {boolean}              | null               | If it is true, the tooltip is visible and has error text styles.                                                                |


## Full example:

```jsx
import { Tooltip } from 'deriv-components';

const DummyComponent = (props) => (
    <Tooltip 
        className='tooltip-storybook-wrapper'
        classNameIcon='tooltip-storybook-icon'
        alignment='right'
        message='Information about the item.'
        icon='question'
        has_error={props.has_error}
    >
        <span>Hover me to see a tooltip.</span>
    </Tooltip>
)
```
