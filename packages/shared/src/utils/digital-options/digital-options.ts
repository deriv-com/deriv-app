import { isEuCountry } from '../location';

type TMessage = {
    title: string;
    text: string;
    link: string;
};

type TShowError = {
    message: string;
    header: string;
    redirect_label: string;
    redirectOnClick: null;
    should_show_refresh: boolean;
    redirect_to: string;
    should_clear_error_on_click: boolean;
};

type TAccounts = {
    residence?: string;
    landing_company_shortcode?: string;
};

export const showDigitalOptionsUnavailableError = (showError: (t: TShowError) => void, message: TMessage) => {
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

export const isEuResidenceWithOnlyVRTC = (accounts: TAccounts[]) => {
    return (
        accounts?.length === 1 &&
        accounts.every(acc => isEuCountry(acc.residence ?? '') && acc.landing_company_shortcode === 'virtual')
    );
};
