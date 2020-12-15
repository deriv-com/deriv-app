# UILoader component
This is a circular loading component.

## Usage
 
```jsx
import { UILoader } from 'deriv-components';

const DummyComponent = (props) => (
    <UILoader />
)
```

## Props

| Name             | Type                   | Default            | Description                                                                                                              |
|------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| className        | {string}               | block-ui__loading  | Spinner's div tag class                                                                                                  |
| classNameBlock   | {string}               | block-ui           | Component's wrapper class                                                                                                |


## Full example:

```jsx
import { UILoader } from 'deriv-components';

const DummyComponent = (props) => (
    <UILoader 
        className='my-spinner-class'
        classNameBlock='my-wrapper-class'
    />
)
```