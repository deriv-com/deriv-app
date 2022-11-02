export type TUiStore = {
    app_contents_scroll_ref: React.RefObject<HTMLElement>;
    current_focus: string | null;
    disableApp: () => void;
    enableApp: () => void;
    has_real_account_signup_ended: boolean;
    is_cashier_visible: boolean;
    is_dark_mode_on: boolean;
    is_mobile: boolean;
    notification_messages_ui: JSX.Element;
    openRealAccountSignup: (value: string) => void;
    setCurrentFocus: (value: string) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    shouldNavigateAfterChooseCrypto: (value: string) => void;
    toggleAccountsDialog: () => void;
    toggleCashier: () => void;
    toggleSetCurrencyModal: () => void;
};
