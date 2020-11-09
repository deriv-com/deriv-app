# MobileWrapper Component

Renders a `MobileWrapper` component which renders the children only if the user's device is mobile and otherwise, renders nothing

# Full example:

```jsx
import React from 'react';
import MobileWrapper from 'Components/mobile-wrapper';

const DummyComponent = props => {    
    return (
        <React.Fragment>
            <MobileWrapper>
                <p style={{ margin: 20, fontSize: 24 }}>This text is just visible in Mobile!</p>
            </MobileWrapper>
            <p style={{ margin: 20, fontSize: 24 }}>This text is always visible!</p>
        </React.Fragment>
    )
}
```
