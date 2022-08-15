export type TUiStore = {
    current_focus: string | null;
    is_dark_mode_on: boolean;
    is_mobile: boolean;
    disableApp: () => void;
    enableApp: () => void;
    setCurrentFocus: (value: string) => void;
    toggleAccountsDialog: () => void;
};
