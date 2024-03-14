import { Analytics, TEvents } from '@deriv-com/analytics';

const form_name = 'ce_bot_dashboard_form';
const form_source = 'ce_bot_dashboard_form';

enum ACTION {
    OPEN = 'open',
    CLOSE = 'close',
    CHOOSE_YOUR_BOT = 'choose_your_bot',
    EDIT_YOUR_BOT = 'edit_your_bot',
    SAVE_YOUR_BOT = 'save_your_bot',
    DELETE_YOUR_BOT = 'delete_your_bot',
    PUSH_OPEN_BUTTON = 'push_open_button',
    CHOOSE_SHORTCUT = 'choose_shortcut',
    PUSH_USER_GUIDE = 'push_user_guide',
}

export const rudderstackDashboardOpen = ({
    bot_name,
    preview_mode,
    bot_last_modified_time,
}: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.OPEN,
        form_source,
        form_name,
        bot_name,
        preview_mode,
        bot_last_modified_time,
    });
};

export const rudderstackDashboardClose = ({
    bot_name,
    preview_mode,
    bot_last_modified_time,
}: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.OPEN,
        form_source,
        form_name,
        bot_name,
        preview_mode,
        bot_last_modified_time,
    });
};

export const rudderstackDashboardChooseYourBot = ({
    bot_name,
    bot_last_modified_time,
}: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.CHOOSE_YOUR_BOT,
        form_name,
        bot_name,
        bot_last_modified_time,
    });
};

export const rudderstackDashboardEditYourBot = ({ bot_name }: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.EDIT_YOUR_BOT,
        form_name,
        bot_name,
    });
};

export const rudderstackDashboardSaveYourBot = ({
    bot_name,
    bot_last_modified_time,
    bot_status,
}: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.SAVE_YOUR_BOT,
        form_name,
        bot_name,
        bot_last_modified_time,
        bot_status,
    });
};

export const rudderstackDashboardDeleteYourBot = ({
    bot_name,
    delete_popup_respond,
}: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.DELETE_YOUR_BOT,
        bot_name,
        delete_popup_respond,
    });
};

export const rudderstackDashboardOpenButton = () => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.PUSH_OPEN_BUTTON,
        form_name,
        form_source,
    });
};

export const rudderstackDashboardChooseShortcut = ({ shortcut_name }: TEvents['ce_bot_dashboard_form']) => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.CHOOSE_SHORTCUT,
        form_name,
        form_source,
        shortcut_name,
    });
};

export const rudderstackDashboardUserGuide = () => {
    Analytics.trackEvent('ce_bot_dashboard_form', {
        action: ACTION.PUSH_USER_GUIDE,
        form_name,
        form_source,
    });
};
