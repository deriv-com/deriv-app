import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name } from './constants';
import { cacheTrackEvents } from '@deriv/shared';

export const rudderStackSendDashboardClickEvent = ({ dashboard_click_name, subpage_name }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.DASHBOARD_CLICK,
                    form_name,
                    subpage_name,
                    dashboard_click_name,
                },
            },
        },
    ]);
};

export const rudderStackSendAnnouncementClickEvent = ({ announcement_name }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: [
                {
                    name: 'ce_bot_form',
                    properties: {
                        action: ACTION.ANNOUNCEMENT_CLICK,
                        form_name,
                        subform_name: 'announcements',
                        subform_source: 'dashboard',
                        announcement_name,
                    },
                },
            ],
        },
    ]);
};

export const rudderStackSendAnnouncementActionEvent = ({
    announcement_name,
    announcement_action,
}: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.ANNOUNCEMENT_ACTION,
                    form_name,
                    subform_name: 'announcements',
                    subform_source: 'dashboard',
                    announcement_name,
                    announcement_action,
                },
            },
        },
    ]);
};
