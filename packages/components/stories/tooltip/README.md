# Tooltip component
Wrap an element to show a tooltip on mouse hover.

## Usage
 
```jsx
import { Tooltip } from 'deriv-components';

const DummyComponent = (props) => (
    <Tooltip 
        className='tooltip-storybook-wrapper'
        classNameIcon='tooltip-storybook-icon'
        alignment='right'
        message='Information about item.'
    >
        <span>Hover me to see tooltip.</span>
    </Tooltip>
)
```

## Props

| Name             | Type                   | Default            | Description                                                                                                              |
|------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| className        | {string}               | null               | Tooltip's wrapper class                                                                                                  |
| classNameIcon    | {string}               | null               | Tooltip's icon class                                                                                                     |
| alignment        | {string}               | null               | Use this to choose placement of the tooltip. It can be top, right, bottom or left.                                       |
| message          | {string}               | null               | It's the info you want to show on tooltip.                                                                               |
| icon             | {string}               | null               | If want to have an icon for your text you can set one of 'info' or 'question' in this prop.                              |
| has_error        | {boolean}              | null               | If is true, tooltip is visible and has error text styles.                                                                |


## Full example:

```jsx
import { SelectNative } from 'deriv-components';

const Tooltip = (props) => (
    <Tooltip 
        className='tooltip-storybook-wrapper'
        classNameIcon='tooltip-storybook-icon'
        alignment='right'
        message='Information about item.'
        icon='question'
        has_error={props.has_error}
    >
        <span>Hover me to see tooltip.</span>
    </Tooltip>
)
```