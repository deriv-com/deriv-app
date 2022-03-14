# Calendar Component

renders a controllable calendar display

#### Supported Events

-   onChangeCalendarMonth

## Usage

```jsx
import Calendar from 'deriv-components';

const DummyComponent = props => <Calendar />;
```

## Props

| Name                  | Type            | Default                 | Description                                      |
| --------------------- | --------------- | ----------------------- | ------------------------------------------------ |
| calendar_view         | {string}        | `date`                  | Allowed calendar views are `date` `month` `year` |
| date_format           | {string}        | `'YYYY-MM-DD'`          | Allowed value format of date                     |
| disabled_days         | [object]        | null                    | Disabled days in the calendar                    |
| events                | {object}        | null                    | Selected holiday dates                           |
| footer                | {string}        | `''`                    | Additional text for footer                       |
| has\_today\_btn       | {boolean}       | `false`                 | Displays today button when `true`                |
| max_date              | {object,string} | `120 years after today` | Maximum date to show in the calender             |
| min_date              | {object,string} | `1970-01-01`            | Minimum date to show in the calendar             |
| onChangeCalendarMonth | {function}      | null                    | Callback function when month is changed          |
| start_date            | {string}        | null                    | Calendar will start rendering in this date       |
| value                 | [object]        | null                    | Default selected date                            |

# Full example:

```jsx
import Calendar from 'deriv-components';

const DummyComponent = props => {
    return (
        <Calendar
            calendar_view='date'
            date_format='YYYY-MM-DD'
            disabled_days={[5]}
            events={[
                {
                    dates: ['2021-07-03', '2021-07-04'],
                    descrip: 'Event Description',
                },
            ]}
            footer={<strong>This is an extra footer</strong>}
            has_today_btn={true}
            has_range_selection={true}
            max_date='2021-07-03'
            min_date='2020-7-02'
            onChangeCalendarMonth={() => console.log('Month has changed')}
            value={toMoment()}
        />
    );
};
```
