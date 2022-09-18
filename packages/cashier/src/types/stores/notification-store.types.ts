type TArgsRemoveNotificationByKey = {
    key: string;
};

type TArgsRemoveNotificationMessage = {
    key: string;
    should_show_again?: boolean;
};

type TButtonProps = {
    onClick: () => void;
    text: string;
};

type TNotificationMessage = {
    action?: {
        onClick: () => void;
        route?: string;
        text: string;
    };
    className?: string;
    cta_btn?: TButtonProps;
    is_disposable?: boolean;
    is_persistent?: boolean;
    header: string;
    header_popup?: string;
    img_alt?: string;
    img_src?: string;
    key: string;
    message: string | JSX.Element;
    message_popup?: string;
    platform?: string;
    primary_btn?: TButtonProps;
    secondary_btn?: TButtonProps;
    should_hide_close_btn?: boolean;
    timeout?: number;
    timeoutMessage?: (remaining: number | string) => string;
    type: string;
};

type TNotification =
    | TNotificationMessage
    | ((withdrawal_locked: boolean, deposit_locked: boolean) => TNotificationMessage)
    | ((excluded_until: number) => TNotificationMessage);

export type TNotificationStore = {
    addNotificationMessage: (message: TNotification) => void;
    filterNotificationMessages: () => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (obj: TArgsRemoveNotificationByKey) => void;
    removeNotificationMessage: (obj: TArgsRemoveNotificationMessage) => void;
};
