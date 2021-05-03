# MobileWrapper Component

A wrapper which shows its children only if the client's device is mobile (in terms of width).

# Full example:

```jsx
import React from 'react';
import MobileWrapper from 'deriv-components';

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
