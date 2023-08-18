import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const BotStopped = observer(() => {
    const { dashboard } = useDBotStore();
    const { is_web_socket_intialised } = dashboard;
    return (
        <>
            <Dialog
                is_visible={!is_web_socket_intialised}
                title={localize('You’re back online')}
                is_mobile_full_width
                className={'dc-dialog bot-stopped-dialog'}
                cancel_button_text={localize('Go to Reports')}
                confirm_button_text={localize('Back to Bot')}
                onCancel={() => location.replace('reports/positions')}
                onClose={() => location.reload()}
                onConfirm={() => location.reload()}
                has_close_icon
            >
                <Text as='p' align='left' size='xs' color='prominent'>
                    {localize(
                        'The bot has stopped, but your trade may still be running. You can check it on the Reports page.'
                    )}
                </Text>
            </Dialog>
        </>
    );
});

export default BotStopped;
