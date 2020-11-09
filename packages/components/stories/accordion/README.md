# Accordion Component

Renders an accordions with a list of inner objects. The objects must have `header` and `content` property and both of them can be a `simple` string or a `node object`.

#### Supported Gestures:

-   Click

## Usage

```jsx
import Accordion from 'Components/accordion';

const DummyComponent = props => (
   <Accordion
        className='accordion__wrapper'
        list={data}
    />
);
```

## Props

| Name          | Type                | Default   | Description                         |
| ------------- | ------------------- | --------- | ----------------------------------- |
| list          | [{header, contant}] | []        | Array contains a list of objects.   |
| classname     | {string}            | null      | Classname for accordion wrapper.    |


# Full example:

```jsx
import Accordion from 'Components/accordion';

const DummyComponent = props => (
    <Accordion
        className='accordion__wrapper'
        list={[ { header: 'header 1', content: 'content 1' },
                { header: 'header 2', content: 'content 2' },
                { header: 'header 3', content: 'content 3' }
        ]}
    />
);
```
