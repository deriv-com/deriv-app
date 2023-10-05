import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const MT5NotificationDescription = () => {
    return (
        <div className={'mt5-notification-modal-description'}>
            <Text as='p' size='xs'>
                <Localize i18n_default_text='Follow these simple steps to fix it:' />
            </Text>
            <ol className='mt5-notification-list-container'>
                <li className='mt5-notification-list-container-item'>
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='Remove your account from the MT5 mobile app:' />
                    </Text>
                    <ul>
                        <li className='mt5-notification-list'>
                            <Text as='p' size='xs'>
                                <Localize
                                    i18n_default_text='For iOS, swipe left on your account and hit <0>Delete</0>.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </li>
                        <li className='mt5-notification-list'>
                            <Text as='p' size='xs'>
                                <Localize
                                    i18n_default_text='For Android, select your account, open Options, and hit <0>Delete</0>.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </li>
                        <li className='mt5-notification-list'>
                            <Text as='p' size='xs'>
                                <Localize
                                    i18n_default_text='Search for <0>Deriv.com Limited</0>.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </li>
                        <li className='mt5-notification-list'>
                            <Text as='p' size='xs'>
                                <Localize i18n_default_text='Add your MT5 account and log in with the same credentials.' />
                            </Text>
                        </li>
                    </ul>
                </li>
                <li className='mt5-notification-list-container-item'>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='If this doesn’t work, reinstall the MT5 mobile app and repeat steps <0>2</0> and '
                            components={[<strong key={0} />]}
                        />
                    </Text>
                </li>
            </ol>
        </div>
    );
};

export default MT5NotificationDescription;
