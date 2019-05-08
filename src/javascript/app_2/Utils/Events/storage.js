export const setStorageEvents = () => {
    window.addEventListener('storage', (evt) => {
        switch (evt.key) {
            case 'active_loginid':
                if (document.hidden && (evt.newValue === '' || !window.is_logging_in)) {
                    window.location.reload();
                }
                break;
            // no default
        }
    });
};
