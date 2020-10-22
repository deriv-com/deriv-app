# Auto Height Wrapper

Renders a wrapper to control the height of elements. `AutoHeightWrapper` does not allow the child component's height to be greater than the client's screen size and makes sure that the children is always visible.


## Usage

```jsx
import AutoHeightWrapper from 'Components/auto-height-wrapper';

const DummyComponent = props => (
    <AutoHeightWrapper default_height={300} height_offset={50}>
        {({ setRef, height }) => (
            <div ref={setRef} style={{height}}/>
        )}
    </AutoHeightWrapper>
);
```

## Props

| Name            | Type            | Default          | Description                                             |
| --------------- | --------------- | ---------------- | ------------------------------------------------------- |
| default_height  | {number}        | null             | Default height of the element.                          |
| height_offset   | {number}        | 0                | Height offset for the element.                          |
| setRef          | {function}      | null             | Function to choose the element to control it's height.  |
| height          | {number}        | default_height   | Tunned height of the element.                           |


# Full example:

```jsx
import Accordion from 'Components/accordion';

const DummyComponent = props => (
    <AutoHeightWrapper default_height={300} height_offset={50}>
        ({ setRef, height }) => (
            <div ref={setRef} style={{height}}>       
                {Array.from(new Array(15)).map((item,index) => {
                    return <p>This is the text number {index}</p>
                })}
            </div>
        )}
    </AutoHeightWrapper>
);
```
