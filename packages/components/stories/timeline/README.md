# Timeline Component

Renders a timeline container

## Usage


```jsx
import RelativeDatepicker from 'Components/relative-datepicker';

const DummyComponent = props => (
    <Timeline>
        <Timeline.Item item_title='Title 1'>
            <div>Timeline 1</div>
        </Timeline.Item>
        <Timeline.Item item_title='Title 2'>
            <div>Timeline 2</div>
        </Timeline.Item>
        <Timeline.Item item_title='Title 3'>
            <div>Timeline 3</div>
        </Timeline.Item>
    </Timeline>
);
```

## Timeline Item Props

| Name       | Type     | Default | Description                |
| ---------- | -------- | ------- | -------------------------- |
| item_title | {string} | `''`    | title of the timeline item |

# Full example:

```jsx
import RelativeDatepicker from 'Components/relative-datepicker';

const DummyComponent = props => (
    <Timeline>
        <Timeline.Item item_title='Title 1'>
            <div>Timeline 1</div>
        </Timeline.Item>
        <Timeline.Item item_title='Title 2'>
            <div>Timeline 2</div>
        </Timeline.Item>
        <Timeline.Item item_title='Title 3'>
            <div>Timeline 3</div>
        </Timeline.Item>
    </Timeline>
);
```
