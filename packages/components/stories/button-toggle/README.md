# ButtonToggle Component

A toggle button list.


#### Supported Gestures:

-   Click

#### Supported Events:

-   onChange

## Usage

```jsx
import ButtonToggle from 'deriv-components';

const DummyComponent = props => (
  <ButtonToggle
        buttons_arr={buttons_list}
        name='type'
        onChange={(item) => setSelected(item.target.value);}
        value={selected}
    />
);
```
## Props

| Name                 | Type                           | Default     | Description                                                                 |
| -------------------- | ------------------------------ | ----------- | --------------------------------------------------------------------------- |
| buttons_arr          | [object<text, value, count?>]  | undefined   | List of buttons                                                             |
| id                   | {string}                       | null        | `id` of the main container                                                  |
| name                 | {string}                       | null        | Name of the ButtonToggle                                                    |
| onChange             | {function}                     | undefined   | Function returns the selected button's value and the name of ButtonToggle   |
| value                | {string \| number}             | null        | The selected button's value                                                 |
| is_animated          | {boolean}                      | `false`     | Use animated ButtonToggle                                                   |
| has\_rounded\_button | {boolean}                      | `false`     | Apply `border-radius` to buttons. Available if `is_animated` is true        |


# Full example:

```jsx
import ButtonToggle from 'deriv-components';

const DummyComponent = props => (
    <React.Fragment>
       <div className={'buttontoggle__wrapper'}>
            <ButtonToggle
                buttons_arr={[
                    {
                        text: 'Buy',
                        value: 'BUY',
                        count:5
                    },
                    {
                        text: 'Sell',
                        value: 'SELL',
                    },
                ];}
                is_animated
                name='type'
                onChange={(item) => setSelected(item.target.value);}
                value={selected}
                has_rounded_button
            />
        </div>
    </React.Fragment>
);
```
