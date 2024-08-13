import React from 'react';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { handleOnConfirmAccumulator } from './utils/accumulator-helper-functions';

export type TContentItem = {
    id: number;
    text: string;
};

export type TAnnounce = {
    main_title: string;
    confirm_button_text: string;
    cancel_button_text: string;
    base_classname: string;
    title?: string;
    subtitle: string;
    content: TContentItem[];
};

export type TAnnouncement = {
    announcement: TAnnounce;
    switch_tab_on_cancel?: number;
    switch_tab_on_confirm?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export const ANNOUNCEMENTS: Record<string, TAnnouncement> = {
    ACCUMULATOR_ANNOUNCE: {
        announcement: {
            main_title: localize('Accumulators now on Deriv Bot'),
            confirm_button_text: localize('Try now'),
            cancel_button_text: localize('Learn more'),
            base_classname: 'announcement-dialog',
            subtitle: localize('Boost your trading strategy with Accumulators'),
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
    id: number;
    icon: React.ReactNode;
    title: React.ReactNode;
    message: React.ReactNode;
    buttonAction: () => void;
    actionText: string;
};
