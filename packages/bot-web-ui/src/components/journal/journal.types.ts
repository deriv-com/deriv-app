type TExtra = {
    currency: string;
    profit: number;
};

type TFilterMessageProps = Array<{
    className: string;
    date: Date; // Data string
    extra: TExtra;
    message: string;
    message_type: string;
    time: Date; // Data
    unique_id: string;
}>;

type TFilters = Array<{ id: string; label: string }>;
type TCheckedFilters = Record<'error' | 'notify' | 'success', string[]>;

export type TFilterDialogProps = {
    toggle_ref: HTMLElement; // yes?
    checked_filters: TCheckedFilters;
    filters: TFilters;
    filterMessage: () => TFilterMessageProps;
    is_filter_dialog_visible: boolean;
    toggleFilterDialog: () => void;
};

export type TToolsProps = {
    checked_filters: TCheckedFilters;
    filters: TFilters;
    filterMessage: () => TFilterMessageProps;
    is_filter_dialog_visible: boolean;
    toggleFilterDialog: () => void;
};
