import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { mt5_community_url } from '@deriv/shared';

type TMT5NotificationDescription = {
    setMT5NotificationModal: (value: boolean) => void;
};
const MT5NotificationDescription = ({ setMT5NotificationModal }: TMT5NotificationDescription) => {
    return (
        <div className={'mt5-notification-modal-description'}>
            <ol className='mt5-notification-list-container'>
                <li className='mt5-notification-list'>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='Log back in to MT5 after 7:30 GMT on 20 Oct 2023 if you’re having difficulty logging in to MT5 as we’re making some updates to our MT5 platform. <0>Follow these steps</0> to log back in to MT5.'
                            components={[
                                <a
                                    className='mt5-notification-list__link'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href={mt5_community_url}
                                    key={0}
                                    onClick={() => {
                                        setMT5NotificationModal(false);
                                    }}
                                />,
                            ]}
                        />
                    </Text>
                </li>
                <li className='mt5-notification-list'>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='If you need further assistance, let us know via <0>live chat</0>.'
                            components={[
                                <a
                                    className='mt5-notification-list__link'
                                    onClick={() => {
                                        window.LC_API.open_chat_window();
                                        setMT5NotificationModal(false);
                                    }}
                                    key={0}
                                />,
                            ]}
                        />
                    </Text>
                </li>
            </ol>
        </div>
    );
};

export default MT5NotificationDescription;
