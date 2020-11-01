# DesktopWrapper Component

Renders a `DesktopWrapper` component which renders the children only if the user's device is desktop and otherwise, renders nothing

# Full example:

```jsx
import React from 'react';
import DesktopWrapper from 'Components/desktop-wrapper';

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
