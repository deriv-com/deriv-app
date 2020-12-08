# Div100vhContainer Component

Renders a `Div100vhContainer` component. In mobile, the `100vh` does not return the correct screen height so, this component helps us to ensure about the correctness of the element's height.


## Props

| Name              | Type         | Default     | Description                                                |
| ----------------- | ------------ | ----------- | ---------------------------------------------------------- |
| id                | {string}     | null        | `id` of the container element                              |
| children          | {React node} | null        | Elements to render inside the container                    |
| height_offset     | {string}     | null        | Height offset for the container                            |
| is_bypassed       | {boolean}    | null        | Bypass the main functionality and just render the children |
| is_disabled       | {boolean}    | null        | To remove the offsets calculation and just tune `100vh`    |
| max\_height\_offset| {string}    | null        | MaxHeight offset for the container                         |


# Full example:

```jsx
import React from 'react';
import Div100vhContainer from 'Components/desktop-wrapper';

const DummyComponent = props => {    
    return (
        <React.Fragment>
            <Div100vhContainer>
                <p style={{ margin: 20, fontSize: 24 }}>My parrent has correct `100vh` style!</p>
            </Div100vhContainer>
        </React.Fragment>
    )
}
```
