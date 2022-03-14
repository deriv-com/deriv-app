# Accordion Component

An accordion with a list of node objects. Objects must have `header` and `content` props and both of them can be a simple `string` or a `node object`.

#### Supported Gestures:

-   Click

## Usage

```jsx
import Accordion from 'deriv-components';

const DummyComponent = props => (
   <Accordion
        className='accordion__wrapper'
        list={data}
    />
);
```

## Props

| Name          | Type                | Default   | Description                           |
| ------------- | ------------------- | --------- | ------------------------------------- |
| list          | [{header, content}] | []        | Array containing the list of objects. |
| className     | {string}            | null      | Accordion wrapper class.              |


# Full example:

```jsx
import Accordion from 'deriv-components';

const DummyComponent = props => (
    <Accordion
        className='accordion__wrapper'
        list={ Array.from(new Array(3)).map((_, i) => ({ header: `header ${i + 1}`, content: `content ${i + 1}`})) }
    />
);
```
