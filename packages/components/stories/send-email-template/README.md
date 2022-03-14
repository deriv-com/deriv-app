# SendEmailTemplate component

Renders a `SendEmailTemplate` component.

## Usage

```jsx
import { SendEmailTemplate } from 'deriv-components';

const DummyComponent = props => (
    <SendEmailTemplate
        lbl_no_receive={`Didn't receive the email?`}
        txt_resend='Resend email'
        txt_resend_in='Resend email in'
    />
);
```

## Props

| Name             | Type       | Default | Description                                           |
| ---------------- | ---------- | ------- | ----------------------------------------------------- |
| onClickSendEmail | {function} | null    | Callback function for onClick function of send button |
| title            | {string}   | null    | Main title of the template                            |
| subtitle         | {string}   | null    | Short description about the email                     |
| lbl\_no\_receive | {string}   | null    | Text for send button                                  |
| txt_resend       | {string}   | null    | Text for resend button                                |
| txt\_resend\_in  | {string}   | null    | Text for resend button with timer                     |

## Full example:

```jsx
import { SendEmailTemplate } from 'deriv-components';

const DummyComponent = props => (
    <SendEmailTemplate
        onClickSendEmail={props.onClickSendEmail}
        title={`We've sent you an email`}
        subtitle='Please click on the link in the email to reset your password.'
        lbl_no_receive={`Didn't receive the email?`}
        txt_resend='Resend email'
        txt_resend_in='Resend email in'
    >
        <div className='send-email-storybook-error'>
            We can’t deliver the email to this address (Usually because of firewalls or filtering).
        </div>
    </SendEmailTemplate>
);
```
