import React from 'react';
import { Localize } from '@deriv/translations';

const LoginHistoryTableTitle = () => ({
    date: <Localize i18n_default_text='Date and time' />,
    action: <Localize i18n_default_text='Action' />,
    browser: <Localize i18n_default_text='Browser' />,
    ip: <Localize i18n_default_text='IP address' />,
    status: <Localize i18n_default_text='Status' />,
});

export default LoginHistoryTableTitle;
