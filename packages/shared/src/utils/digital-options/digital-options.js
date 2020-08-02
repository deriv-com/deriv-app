export const showDigitalOptionsUnavailableError = (showError, message) => {
    const { title, text, link } = message;
    showError(
        title,
        text,
        link,
        () => (window.location.href = `${location.protocol}//${location.hostname}/mt5`),
        false
    );
};
