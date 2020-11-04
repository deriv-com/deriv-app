# FadeWrapper Component

Renders a `FadeWrapper` component.


## Usage

```jsx
import FadeWrapper from 'Components/fade-wrapper';

const DummyComponent = props => (
   <FadeWrapper
        is_visible={visibility}
        type={'top'}>
        <p className={'fade-wrapper__content'}>This text is inside the fade wrapper</p>
    </FadeWrapper>
);
```

## Props


| Name          | Type         | Default     | Description                                                       |
| ------------- | ------------ | ----------- | ----------------------------------------------------------------- |
| is_visible    | {boolean}    | null        | Visibility of the FadeWrapper                                     |
| type          | {string}     | null        | Type of fading. One of `'top'`, `'bottom'` or null for just fade   |
| keyname       | {string}     | null        | Key name for the wrapper                                          |
| className     | {string}     | null        | classname for the wrapper                                         |




# Full example:

```jsx
import React, { useState } from 'react';
import DropdownList from 'Components/dropdown-list';
import Button from 'Components/button';

const DummyComponent = props => {

    const [visibility, setVisibility] = React.useState(false)
    const toggleVisibility = () => setVisibility(!visibility);

    return (
        <React.Fragment>
            <Button onClick={toggleVisibility} text={'Fade!'} primary medium />
            <FadeWrapper
                is_visible={visibility}>
                <p className={'fade-wrapper__content'}>This text is inside the fade wrapper</p>
            </FadeWrapper>
        </React.Fragment>
    );
}
```
