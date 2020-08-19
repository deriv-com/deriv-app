export const showDigitalOptionsUnavailableError = (showError, message) => {
    const { title, text, link } = message;
    showError({
        message: text,
        header: title,
        redirect_label: link,
        redirectOnClick: null,
        should_show_refresh: false,
        where_to: '/mt5',
        with_history: true,
    });
};
