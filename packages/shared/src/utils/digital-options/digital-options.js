export const showDigitalOptionsUnavailableError = (showError, message) => {
    const { title, text, link } = message;
    showError(
        title, // Header
        text, // Message
        link, // Redirect label
        null, // Redirect onClick
        false, // Should show refresh?
        '/mt5', // Where to
        true // With history? (not window.location)
    );
};
