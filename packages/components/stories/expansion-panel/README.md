# ExpansionPanel Component

Renders an `ExpansionPanel` component which is a list of expandable values.


#### Supported Gestures:

-   Click

## Usage

```jsx
import ExpansionPanel from 'Components/expansion-panel';

const DummyComponent = props => (
    <ExpansionPanel message={message} />
);
```

## Props


| Name              | Type         | Default     | Description                                |
| ----------------- | ------------ | ----------- | ------------------------------------------ |
| message           | {object}     | null        | Object of the list to show                 |


## Message Structure


| Name                | Type                                     | Default     | Description                           |
| ------------------- | ---------------------------------------- | ----------- | ------------------------------------- |
| header `(optional)` | {string}                                 | null        | Header of the list                    |
| content             | [object<id, value:{string \| content}>]  | null        | An object contains `id` and `value`. The `value` can be a simple string or an object of `content` recursively.   |




# Full example:

```jsx
import React, { useState } from 'react';
import DropdownList from 'Components/dropdown-list';

const DummyComponent = props => {

    const message = {
                header: 'Airplains', content: [
                    {
                        id: 'boeing', value: [
                            { id: 1, value: 'Boeing 777' },
                            { id: 2, value: 'Boeing 750' }
                        ]
                    },
                    {
                        id: 'Airbus', value: [
                            { id: 1, value: 'Airbus A380' },
                            { id: 2, value: 'Airbus A320' },
                            { id: 3, value: 'Airbus A330' }]
                    },
                    { id: 'Embraer', value: 'Embrear 190' }
                ]
            }

    return (
        <React.Fragment>
            <ExpansionPanel message={message} />
        </React.Fragment>
    );
}
```
