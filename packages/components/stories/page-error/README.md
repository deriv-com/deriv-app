# PageError component
Use this component to show an error page.

## Usage
 
```jsx
import { PageError } from 'deriv-components';

const DummyComponent = (props) => (
    <PageError
        header='We couldn’t find that page'
        messages={['Error Code: 404 page not found']}
    />
);
```

## Props

| Name                            | Type                   | Default            | Description                                                                                                              |
|---------------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| header                          | {string \| node }      | null               |                                                                                                                          |
| messages                        | {array}                | null               | Array of strings as error text                                                                                           |
| image\_url                      | {string}               | null               | This image will be shown beside the error text                                                                           |
| classNameImage                  | {string}               | null               |                                                                                                                          |
| redirect\_label                 | {string}               | null               | Redirect button text                                                                                                     |
| redirect\_url                   | {string}               | null               | Where you want to land user after clicking on redirect button                                                            |
| setError                        | {function}             | null               | Function to remove error on the parent component                                                                         |
| should\_clear\_error\_on_click  | {boolean}              | null               | Set it to true to disable error on parent component on redirect. `setError` must be defined                               |


## Full example:

```jsx
import { PageError } from 'deriv-components';

const DummyComponent = (props) => (
    <PageError
        header='We couldn’t find that page'
        messages={props.messages}
        classNameImage='may-class'
        image_url={props.image_url}
        redirect_label={props.redirect_label}
        buttonOnClick={props.buttonOnClick}
        redirect_url={props.redirect_url}
    />
);
```
