export const setStorageEvents = (root_store) => {
    window.addEventListener('storage', (evt) => {
        switch (evt.key) {
            case 'active_loginid':
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            case 'verification_code':
                if (document.hidden && root_store.ui.is_cashier_modal_on && root_store.ui.active_cashier_tab === 'withdraw') {
                    root_store.modules.cashier.clearVerification();
                    root_store.ui.toggleCashierModal();
                }
            // no default
        }
    });
};
