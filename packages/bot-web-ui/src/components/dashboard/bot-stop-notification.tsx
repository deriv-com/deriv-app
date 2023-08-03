import React from 'react';
import { Toast } from '@deriv/components';
import { Localize } from '@deriv/translations';

const BotStopNotification = () => {
    return (
        <div className='bot-stop-notification'>
            <div>
                <Toast timeout={6000}>
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
                </Toast>
            </div>
        </div>
    );
};

export default BotStopNotification;
