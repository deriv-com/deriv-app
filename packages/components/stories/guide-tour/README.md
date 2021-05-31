# GuideTour Component

A component to create a guided onboarding tour inside our application.

## Usage

GuideTour requires a `steps` array and a `settings` object to be passed as properties. It will use settings object as a default settings setup, while you are able to override each step individual settings inside steps array.

Settings object must include localized `text_labels` object to pass labels for each button.

Steps array consists of object, where each one represent a single onboarding step and should include `selector` (ref, id or classname), `content`, and the step `title`, as well as the other step settings.

Each step can also include substeps that will be triggered and executed after a certain DOM change observed, f.e. our user clicks on a button.

```jsx
import GuideTour from '@deriv/components';

const DummyComponent = props => (
    <GuideTour steps={steps} settings={default_tour_settings} />
);
```

## Props

| Name        | Type            | Default     | Description                                         |
| ----------- | --------------- | ----------- | --------------------------------------------------- |
| steps       | {array}         | null        | Array of onboarding steps                           |
| settings    | {object}        | null        | Object with default settings used accross the steps |
| is_open     | {boolean}       | true        | Identifies if the onboarding open or closed         |

### Settings props

| Name               | Type      | Default | Description                                                    |
| ------------------ | --------- | ------- | -------------------------------------------------------------- |
| closeWithMask      | {boolean} | false   | Set if onboarding can be closed by clicking outside of a modal |
| hide_buttons       | {boolean} | false   | Hide all the step controls (Back, Next)                        |
| hide_next_step     | {boolean} | false   | Hide Next step button                                          |
| hide_previous_step | {boolean} | false   | Hide previous step button                                      |
| localized_labels   | {object}  | null    | Pass localized button labels (must include: back, next, last ) |

### Step props

| Name               | Type              | Default | Description                                                    |
| ------------------ | ----------------- | ------- | -------------------------------------------------------------- |
| action             | {function}        | null    | A function that will be executed once the step is shown        |
| content            | {string or node}  | null    | Guide modal content                                            |
| hide_buttons       | {boolean}         | false   | Hide all the step controls (Back, Next)                        |
| hide_next_step     | {boolean}         | false   | Hide Next step button                                          |
| hide_previous_step | {boolean}         | false   | Hide previous step button                                      |
| observe            | {string or node}  | null    | Observe an element and trigger substep when it's shown         |
| position           | {string or array} | null    | custom guide modal position                                    |
| selector           | {string or node}  | null    | Selector used to highlight and place a guide                   |
| stepInteraction    | {boolean}         | true    | Disable or enable ability to interact with highlighted element |
| style              | {object}          | null    | Additional css styles to modify a specific step                |
| substep            | {object}          | null    | Substep that will be opened when a certain element is observed |
| title              | {string}          | null    | Guide modal title                                              |

# Full example:

```jsx
import { GuideTour as Guide } from '@deriv/components';
import { localize } from '@deriv/translations';

const DummyComponent = props => {
    const default_tour_settings = {
        text_labels: {
            back: localize('Back'),
            next: localize('Next'),
            last: localize('Finish'),
        },
        hidePreviousStep: true,
        close_with_mask: true,
    };

    const steps = [
        {
            selector: '.acc-info__wrapper',
            title: 'Sequi ratione eligendi',
            content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
            observe: '.acc-info__wrapper',
            substep: {
                selector: 'acc-info__wrapper',
                title: 'Quae totam voluptatem',
                content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
                hideButtons: false,
                observe: '#modal_root',
            },
        },
        {
            selector: '.btn-purchase--2',
            title: 'Commodi culpa alias.',
            content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
        },
        {
            selector: '#dt_cashier_tab',
            title: 'Modi aliquam',
            content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
        },
    ];
    
    return (
        <React.Fragment>
            <Guide steps={steps} settings={default_tour_settings} />
        </React.Fragment>
    )};
```
