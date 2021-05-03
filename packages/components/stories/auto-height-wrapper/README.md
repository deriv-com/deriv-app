# Auto Height Wrapper

A wrapper to control the height of its children. `AutoHeightWrapper` does not allow the child components' height to be greater than the client's screen size and makes sure that the children are always visible.


## Usage

```jsx
import AutoHeightWrapper from 'deriv-components';

const DummyComponent = props => (
    <AutoHeightWrapper default_height={300} height_offset={50}>
        {({ setRef, height }) => (
            <div ref={setRef} style={{height}}/>
        )}
    </AutoHeightWrapper>
);
```

## Props

| Name            | Type            | Default          | Description                                                                        |
| --------------- | --------------- | ---------------- | ---------------------------------------------------------------------------------- |
| default_height  | {number}        | null             | Default height of the element.                                                     |
| height_offset   | {number}        | 0                | Height offset for the element.                                                     |
| setRef          | {function}      | null             | Function to set a reference to the element which the wrapper controls its height.  |
| height          | {number}        | default_height   | Tunned height of the element.                                                      |


# Full example:

```jsx
import AutoHeightWrapper from 'deriv-components';

const DummyComponent = props => (
    <AutoHeightWrapper default_height={300} height_offset={50}>
        ({ setRef, height }) => (
            <div ref={setRef} style={{height}}>       
                {Array.from(new Array(15)).map((_,index) => {
                    return <p>This is the text number {index}</p>
                })}
            </div>
        )}
    </AutoHeightWrapper>
);
```
