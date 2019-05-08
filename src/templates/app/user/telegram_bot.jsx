import React from 'react';
import { FormRow, SubmitButton, Fieldset } from '../../_common/components/forms.jsx';

const TelegramBot = () => (
    <React.Fragment>
        <h1>{it.L('Telegram Bot')}</h1>

        <p>{it.L('In order to access Telegram Bot, please [_1]generate an API Token[_2] and enter it in the input box below.', `<a href="${it.url_for('user/security/api_tokenws')}">`, '</a>')}</p>

        <form className='gr-padding-10' id='frm_telegram_bot'>
            <Fieldset>
                <FormRow type='text' id='token' label={it.L('API Token')} attributes={{ maxLength: 128 }} />
                <SubmitButton type='submit' id='go_to_telegram' text={it.L('Go')} />
            </Fieldset>
        </form>
    </React.Fragment>
);

export default TelegramBot;
