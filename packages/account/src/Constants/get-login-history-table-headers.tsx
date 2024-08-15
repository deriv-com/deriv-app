import { Localize } from '@deriv-com/translations';

const getLoginHistoryTableHeaders = () => ({
    date_title: <Localize i18n_default_text='Date and time' />,
    action_title: <Localize i18n_default_text='Action' />,
    browser_title: <Localize i18n_default_text='Browser' />,
    ip_title: <Localize i18n_default_text='IP address' />,
    status_title: <Localize i18n_default_text='Status' />,
});

export default getLoginHistoryTableHeaders;
