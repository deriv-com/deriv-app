# DesktopWrapper Component

A wrapper which shows its children only if the client's device is desktop (in terms of width).

# Full example:

```jsx
import React from 'react';
import DesktopWrapper from 'deriv-components';

const DummyComponent = props => {    
    return (
        <React.Fragment>
            <DesktopWrapper>
                <p style={{ margin: 20, fontSize: 24 }}>This text is just visible in desktop!</p>
            </DesktopWrapper>
            <p style={{ margin: 20, fontSize: 24 }}>This text is always visible!</p>
        </React.Fragment>
    )
}
```
