# LinearProgress Component

Renders a `LinearProgress` component. The LinearProgress component can run an action after a certain timeout.



## Usage

```jsx
import LinearProgress from 'Components/linear-progress';

const DummyComponent = props => (
    <LinearProgress
        timeout={5000}
        action={() => { console.log('Completed') }}
        render={(remaining) => { return <p>{remaining}</p> }}
    />
);
```

## Props

| Name        | Type         | Default     | Description                          |
| ----------- | ------------ | ----------- | ------------------------------------ |
| timeout     | {number}     | null        | Timeout in millisecond               |
| action      | {function}   | null        | Function to run after the timeout    |
| render      | {function}   | null        | Function returns the remaining time  |
| className   | {string}     | null        | `className` for the main container   |


# Full example:

```jsx
import React from 'react';
import LinearProgress from 'Components/linear-progress';

const DummyComponent = props => {
    
    return (
        <React.Fragment>
            <LinearProgress
                timeout={5000}
                action={() => { console.log('Completed') }}
                render={(remaining) => { return <p>{remaining}</p> }}
            />
        </React.Fragment>
    )
}
```