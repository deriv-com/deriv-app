# Relative DatePicker Component

Renders a native date picker for mobile that returns value in days relative to current date. When user clicks on title, the native date picker of mobile will show up. (View this page in mobile device for correct functionality)

#### Supported Gestures:

-   Click


#### Supported events:

- onChange


## Usage

```jsx
import RelativeDatepicker from 'Components/relative-datepicker';

const DummyComponent = props => (
   <RelativeDatepicker
        onChange={(date) => { console.log(date) }}
        min={0}
        max={5}
        title={'Pick a date'}
    />
);
```

## Props

| Name                          | Type               | Default   | Description                                                                            |
| ----------------------------- | ------------------ | --------- | -------------------------------------------------------------------------------------- |
| onChange                      | {function}         | undefined | Function returns value in amount of days, relative to date selected and current date.  |
| title                         | {string}           | null      | Title of the date picker                                                               |
| min                           | {string \| number} | 0         | Minimum selectable date offset                                                         |
| max                           | {string \| number} | 0         | Maximum selectable date offset                                                         |


# Full example:

```jsx
import RelativeDatepicker from 'Components/relative-datepicker';

const DummyComponent = props => (
   <RelativeDatepicker
        onChange={(date) => { console.log(date) }}
        min={0}
        max={5}
        title={'Pick a date'}
    />
);
```
