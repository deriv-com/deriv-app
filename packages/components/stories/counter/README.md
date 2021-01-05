# Counter Component

Renders a `Counter` component containing a number


## Usage

```jsx
import Counter from 'deriv-components';

const DummyComponent = props => (
    <Counter count={5} className='counter' />
);
```

## Props

| Name               | Type         | Default     | Description                             |
| ------------------ | ------------ | ----------- | --------------------------------------- |
| className          | {string}     | null        | The classname of the main component     |
| count              | {string}     | null        | Number to show                          |

# Full example:

```jsx
import React from 'react';
import Counter from 'deriv-components';

const DummyComponent = props => {    
    return (
        <React.Fragment>
            <div className={'counter__wrapper'}>
                 <Counter count={5} className='counter' />
            </div>
        </React.Fragment>
    )
}
```
