export type TUiStore = {
    current_focus: string | null;
    is_dark_mode_on: boolean;
    is_mobile: boolean;
    setCurrentFocus: (value: string) => void;
};
