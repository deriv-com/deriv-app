import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { Icon, Toast } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const BotStopNotification = observer(() => {
    const { run_panel } = useDBotStore();
    const { setShowBotStopMessage } = run_panel;
    const notification_timer = useRef(6000);

    const notificationTimer = setTimeout(() => {
        if (notification_timer.current) {
            setShowBotStopMessage(false);
        }
    }, notification_timer.current);

    const resetTimer = () => {
        setTimeout(() => {
            setShowBotStopMessage(false);
        }, 4000);
    };

    return (
        <div
            className='bot-stop-notification'
            onMouseOver={e => {
                clearTimeout(notificationTimer);
            }}
            onMouseLeave={e => {
                resetTimer();
            }}
            data-testid='bot-stop-notification'
        >
            <Toast>
                <div>
                    <Localize
                        i18n_default_text='You’ve just stopped the bot. Any open contracts can be viewed on the <0>Reports</0> page.'
                        components={[
                            <a
                                key={0}
                                style={{ color: 'var(--general-main-1)' }}
                                rel='noopener noreferrer'
                                target='_blank'
                                href={'/reports'}
                            />,
                        ]}
                    />
                </div>
                <Icon
                    icon='IcCross'
                    className={'notification-close'}
                    data_testid={'notification-close'}
                    onClick={() => setShowBotStopMessage(false)}
                />
            </Toast>
        </div>
    );
});

export default BotStopNotification;
