import React from 'react';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { handleOnConfirmAccumulator } from './utils/accumulator-helper-functions';
import { IconAnnounce } from './announcement-components';

export type TContentItem = {
    id: number;
    text: string;
};

export type TAnnounce = {
    id: number;
    main_title: string;
    confirm_button_text: string;
    cancel_button_text: string;
    base_classname: string;
    title: string;
    content: TContentItem[];
};

export type TAnnouncement = {
    announcement: TAnnounce;
    switch_tab_on_cancel?: number;
    switch_tab_on_confirm?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
    url_redirect?: string;
};

export const ANNOUNCEMENTS: Record<string, TAnnouncement> = {
    ACCUMULATOR_ANNOUNCE: {
        announcement: {
            id: 0,
            main_title: localize('Accumulators now on Deriv Bot'),
            confirm_button_text: localize('Try now'),
            cancel_button_text: localize('Learn more'),
            base_classname: 'announcement-dialog',
            title: localize('Boost your trading strategy with Accumulators'),
            content: [
                {
                    id: 0,
                    text: localize('Trade Accumulators to build up potential profits with a structured approach.'),
                },
                {
                    id: 1,
                    text: localize('Customise your investment period and price levels to fit your trading goals.'),
                },
                { id: 2, text: localize('Manage risks while capitalising on market opportunities.') },
            ],
        },
        switch_tab_on_cancel: DBOT_TABS.TUTORIAL,
        switch_tab_on_confirm: DBOT_TABS.BOT_BUILDER,
        onConfirm: handleOnConfirmAccumulator,
    },
};

export type TAnnouncementItem = {
    id: string;
    icon: React.ReactElement;
    title: string;
    message: string;
    date: string;
    buttonAction: string;
    actionText: string;
};

export type TNotifications = {
    key: string;
    icon: React.ReactNode;
    title: React.ReactNode;
    message: React.ReactNode;
    buttonAction: (() => void) | false | void;
    actionText: string;
};

export const BUTTON_ACTION_TYPE = {
    MODAL_BUTTON_ACTION: 'modal_button_action',
    REDIRECT_BUTTON_ACTION: 'redirect_button_action',
    NO_ACTION: 'no_action',
};

export const BOT_ANNOUNCEMENTS_LIST: TAnnouncementItem[] = [
    {
        id: 'ACCUMULATOR_ANNOUNCE',
        icon: IconAnnounce,
        title: localize('Accumulators is now on Deriv Bot'),
        message: localize('Boost your trading strategy with Accumulators.'),
        date: '2 July 2024 00:00 UTC',
        buttonAction: BUTTON_ACTION_TYPE.MODAL_BUTTON_ACTION,
        actionText: '',
    },
];
