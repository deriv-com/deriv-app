# SwipeableWrapper component
Use this component only on mobile to have a swipeable wrapper.

#### Supported events:
All events for 'react-swipeable' plugin except 'onSwipedRight' and 'onSwipedLeft' because we're using them in the component.
Please take a look at plugin's page to get more information  https://github.com/FormidableLabs/react-swipeable .

## Usage
 
```jsx
import { SwipeableWrapper } from 'deriv-components';

const DummyComponent = (props) => (
    <SwipeableWrapper>
        {props.slides.map(id => (
            <Slide id={id + 1} key={id} />
        ))}
    </SwipeableWrapper>
);
```

## Props

| Name                     | Type                   | Default            | Description                                                                                                              |
|--------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| onChange                 | {function}             | null               | Callback function for swipe event                                                                                        |
| is_disabled              | {boolean}              | null               | Set it to 'true' to disable the 'react-swipeable' functions                                                              |


## Full example:

```jsx
import { SwipeableWrapper } from 'deriv-components';

const DummyComponent = (props) => (
    <SwipeableWrapper 
        onChange={props.onChange} 
        is_disabled={props.is_disabled}
    >
        {props.slides.map(id => (
            <Slide id={id + 1} key={id} />
        ))}
    </SwipeableWrapper>
);
```