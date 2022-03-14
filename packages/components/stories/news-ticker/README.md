# Newsticker Component

A component to show sliding news

## Usage

```jsx
import Newsticker from 'deriv-components';

const DummyComponent = props => (
    <Newsticker speed={40}>
        <div>News 1</div>
        <div>News 2</div>
        <div>News 3</div>
    </Newsticker>
);
```

## Props

| Name      | Type      | Default | Description                      |
| --------- | --------- | ------- | -------------------------------- |
| className | {string } | `''`    | custom class name for newsticker |
| speed     | {number}  | `null`  | the speed of slide of newsticker |

# Full example:

```jsx
import Newsticker from 'deriv-components';

const DummyComponent = props => {
    return (
        <Newsticker className='test-newsticker' speed={40}>
            <div>News 1</div>
            <div>News 2</div>
            <div>News 3</div>
        </Newsticker>
    );
};
```
