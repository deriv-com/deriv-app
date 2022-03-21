import { isEuCountry } from '../location';

export const showDigitalOptionsUnavailableError = (showError, message) => {
    const { title, text, link } = message;
    showError({
        message: text,
        header: title,
        redirect_label: link,
        redirectOnClick: null,
        should_show_refresh: false,
        redirect_to: '/mt5',
        should_clear_error_on_click: true,
    });
};

export const isEuResidenceWithOnlyVRTC = accounts => {
    return (
        accounts?.length === 1 &&
        accounts.every(acc => isEuCountry(acc.residence) && acc.landing_company_shortcode === 'virtual')
    );
};
