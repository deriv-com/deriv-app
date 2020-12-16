# FormProgress Component

A progress bar for forms.


## Usage

```jsx
import FormProgress from 'deriv-components';

const DummyComponent = props => (
    <FormProgress steps={steps} current_step={currentStep} />
);
```

## Props


| Name          | Type                                         | Default  | Description                                                                          |
| ------------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| steps         | [object< header: object< title, active\_title >>] | null     | Array of steps. Each item has a `header` which contains `title` and `active_title`.  |
| current_step  | {number}                                     | null     | Current index of the progress                                                        |



# Full example:

```jsx
import React, { useState } from 'react';
import FormProgress from 'deriv-components';

 const steps = [
                { header: { active_title: 'This is the first step', title: 'step 1' } },
                { header: { active_title: 'This is the second step', title: 'step 2' } },
                { header: { active_title: 'This is the third step', title: 'step 3' } },
                { header: { active_title: 'This is the fourth step', title: 'step 4' } }
            ]

const DummyComponent = props => {

    return (
        <React.Fragment>
            <FormProgress steps={steps} current_step={0} />
        </React.Fragment>
    );
}
```
