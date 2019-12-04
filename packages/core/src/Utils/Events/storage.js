export const setStorageEvents = () => {
    window.addEventListener('storage', (evt) => {
        switch (evt.key) {
            case 'active_loginid':
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            // no default
        }
    });
};
