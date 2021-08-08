# Button component

Use this component to show buttons

#### Supported Events

-   onClick

## Usage

```jsx
import { Button } from 'deriv-components';

const DummyComponent = props => <Button onClick={() => console.log('clicked')} text='My Custom Button' />;
```

## Props

| Name              | Type       | Default  | Description                                                        |
| ----------------- | ---------- | -------- | ------------------------------------------------------------------ |
| blue              | {boolean}  | `false`  | button is blue color                                               |
| className         | {string}   | `''`     | additional class name for button component                         |
| classNameSpan     | {string}   | `''`     | additional custom class name span element in the button            |
| green             | {boolean}  | `false`  | button is green                                                    |
| has_effect        | {string}   | `''`     | when button is focused it will show an effect                      |
| icon              | {node}     | `'null`  | add icon to button component                                       |
| id                | {string}   | `''`     | custom id for button component                                     |
| is_disabled       | {boolean}  | `false`  | disable the button                                                 |
| is_loading        | {boolean}  | `false`  | show loading in the button                                         |
| is\_submit\_success | {boolean}  | `false`  | callback flag to for successful submission                         |
| is\_button\_toggle  | {boolean}  | `false`  | convert to a toggle button                                         |
| is_circle         | {boolean}  | `false`  | button shape is circular                                           |
| is_plus           | {boolean}  | `false ` | show a plus icon in the button                                     |
| large             | {boolean}  | `false`  | large sized button                                                 |
| medium            | {boolean}  | `false`  | medium sized button                                                |
| onClick           | {function} | `null`   | callback function when button is clicked                           |
| tabIndex          | {number}   | `0`      | reference index for button                                         |
| text              | {string}   | `''`     | text in the button                                                 |
| wrapperClassName  | {number}   | `''`     | when assigned button will get wrapped in a div with that className |
| type              | {string}   | `button` | type of the button                                                 |
| primary           | {boolean}  | `false`  | primary colored button                                             |
| primary_light     | {boolean}  | `false`  | light primary colored button                                       |
| secondary         | {boolea}   | `false`  | secondary colored button                                           |
| alternate         | {boolean}  | `false`  | alternate color for button                                         |
| small             | {boolean}  | `false`  | small sized button                                                 |
| tertiary          | {boolean}  | `false`  | tertiary colroed button                                            |
| renderText        | {function} | `null`   | function to handle special rendering of text in the button         |

## Full example:

```jsx
import { Button } from 'deriv-components';
import Icon from '../icon';

const DummyComponent = props => {
    render(
        <Button
            blue
            className='custom-btn'
            classNameSpan='custom-span'
            green
            has_effect
            icon={<Icon icon='IcAlertDanger' size={18} />}
            id='custom-id'
            is_disabled={false}
            is_loading={false}
            is_submit_success={false}
            is_button_toggle={false}
            is_circle={false}
            is_plus={false}
            large={false}
            medium={true}
            onClick={() => console.log('clicked!')}
            rounded={true}
            tabIndex={1}
            text='My Custom Button'
            wrapperClassName=''
            type='button'
            primary={false}
            primary_light={false}
            secondary={true}
            alternate={false}
            small={false}
            tertiary={false}
            renderText={text => <i>special {text}</i>}
        />
    );
};
```
