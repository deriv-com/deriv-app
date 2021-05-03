# DateOfBirthPicker Component

A desktop date picker component to get the user's birthdate based on `age` value. Allowed `age` range is from 18 to 100 (excluding).


#### Supported Gestures:

-   Click

#### Supported Events:

-   onChange

## Usage

```jsx
import DateOfBirthPicker from 'deriv-components';

const DummyComponent = props => (
    <DateOfBirthPicker
        name='date_of_birth'
        label={'Date of birth*'}
        onChange={({ target }) => console.log(toMoment(target.value).format('YYYY-MM-DD'))}
    />
);
```

## Props


| Name               | Type         | Default     | Description                                                 |
| ------------------ | ------------ | ----------- | ----------------------------------------------------------- |
| name               | {string}     | null        | Name of the DateOfBirthPicker                               |
| lable              | {string}     | null        | Lable of the DateOfBirthPicker                              |
| value              | {string}     | null        | Default value of the DateOfBirthPicker                      |
| onChange           | {function}   | undefined   | Function returns current value of DateOfBirthPicker         |


# Full example:

```jsx
import React from 'react';
import DateOfBirthPicker from 'deriv-components';

const DummyComponent = props => {    
    return (
        <React.Fragment>
            <div className={'date-of-birth-picker__wrapper'}>
                <DateOfBirthPicker
                    name='date_of_birth'
                    label={'Date of birth*'}
                    onChange={({ target }) => console.log(toMoment(target.value).format('YYYY-MM-DD'))}
                />
            </div>
        </React.Fragment>
    )
}
```
