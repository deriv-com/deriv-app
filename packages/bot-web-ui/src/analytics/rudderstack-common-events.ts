import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name, TFormStrategy } from './constants';
import { getRsStrategyType } from './utils';
import { cacheTrackEvents } from '@deriv/shared';
import { action } from 'mobx';

export const rudderStackSendOpenEvent = ({
    subpage_name,
    subform_source,
    subform_name,
    load_strategy_tab,
}: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.OPEN,
                    form_name,
                    subpage_name,
                    subform_name,
                    subform_source,
                    load_strategy_tab,
                },
            },
        },
    ]);
};

export const rudderStackSendCloseEvent = ({
    subform_name,
    quick_strategy_tab,
    selected_strategy,
    load_strategy_tab,
    announcement_name,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.CLOSE,
                    form_name,
                    subform_name,
                    quick_strategy_tab,
                    strategy_name: getRsStrategyType(selected_strategy),
                    load_strategy_tab,
                    announcement_name,
                },
            },
        },
    ]);
};

export const rudderStackSendRunBotEvent = ({ subpage_name }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.RUN_BOT,
                    form_name,
                    subpage_name,
                },
            },
        },
    ]);
};

export const rudderStackSendUploadStrategyStartEvent = ({ upload_provider, upload_id }: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.UPLOAD_STRATEGY_START,
                    form_name,
                    subform_name: 'load_strategy',
                    subpage_name: 'bot_builder',
                    upload_provider,
                    upload_id,
                },
            },
        },
    ]);
};

export const rudderStackSendUploadStrategyCompletedEvent = ({
    upload_provider,
    upload_id,
    upload_type,
}: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.UPLOAD_STRATEGY_COMPLETED,
                    form_name,
                    subform_name: 'load_strategy',
                    subpage_name: 'bot_builder',
                    upload_provider,
                    upload_id,
                    upload_type,
                },
            },
        },
    ]);
};

export const rudderStackSendUploadStrategyFailedEvent = ({
    upload_provider,
    upload_id,
    upload_type,
    error_message,
    error_code,
}: TEvents['ce_bot_form']) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.UPLOAD_STRATEGY_FAILED,
                    form_name,
                    subform_name: 'load_strategy',
                    subpage_name: 'bot_builder',
                    upload_provider,
                    upload_id,
                    upload_type,
                    error_message,
                    error_code,
                },
            },
        },
    ]);
};

export const rudderStackSendGoogleDriveConnectEvent = () => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.GOOGLE_DRIVE_CONNECT,
                    form_name,
                    subpage_name: 'bot_builder',
                },
            },
        },
    ]);
};

export const rudderStackSendGoogleDriveDisconnectEvent = () => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_bot_form',
                properties: {
                    action: ACTION.GOOGLE_DRIVE_DISCONNECT,
                    form_name,
                    subpage_name: 'bot_builder',
                },
            },
        },
    ]);
};
