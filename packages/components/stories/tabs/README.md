# Tabs component
This component makes tabs with navigation header from a group of elements.

## Usage
 
```jsx
import { Tabs } from 'deriv-components';

const DummyComponent = (props) => (
    <Tabs>
        <div header_content='Tab one'>
            Content for tab 1
        </div>
        <div header_content='Tab two'>
            Content for tab 2
        </div>
        <div header_content='Tab three'>
            Content for tab 3
        </div>
    </Tabs>
)
```

## Props

| Name                     | Type                   | Default            | Description                                                                                                              |
|--------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| top                      | {boolean}              | null               | Set it to 'true' to have the navigation on top                                                                           |
| bottom                   | {boolean}              | null               | Set it to 'true' to have the navigation on bottom                                                                        |
| center                   | {boolean}              | null               | Set it to 'true' to have the centered tabs                                                                               |
| fit_content              | {boolean}              | null               | Set it to 'true' to have fixed tabs by '150px' width                                                                     |
| single\_tab\_has\_no\_label  | {boolean}              | null               | Set it to 'true' to remove tabs when there is only one tab                                                               |


## Full example:

```jsx
import { Tabs } from 'deriv-components';

const DummyComponent = (props) => (
    <Tabs
        top
        header_fit_content
        single_tab_has_no_label    
    >
        <div header_content='Tab one' label='Tab label'>
            Content for tab 1
        </div>
        <div header_content='Tab two' label='Tab label'>
            Content for tab 2
        </div>
        <div header_content='Tab three' label='Tab label'>
            Content for tab 3
        </div>
    </Tabs>
)
```