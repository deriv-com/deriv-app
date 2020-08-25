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
