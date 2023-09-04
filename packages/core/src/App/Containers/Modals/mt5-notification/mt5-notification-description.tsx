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
                        <Localize i18n_default_text='On your MT5 mobile app, delete your existing Deriv account:' />
                    </Text>
                    <ul>
                        <li className='mt5-notification-list'>
                            <Text as='p' size='xs'>
                                <Localize
                                    i18n_default_text='- iOS: Swipe left on the account and tap <0>Delete</0>.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </li>
                        <li className='mt5-notification-list'>
                            <Text as='p' size='xs'>
                                <Localize
                                    i18n_default_text='- Android: Tap the account, open <0>Options</0>, and tap <0>Delete</0>.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </li>
                    </ul>
                </li>
                <li className='mt5-notification-list-container-item'>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='Search for the broker <0>Deriv Holdings (Guernsey) Limited</0> and select it.'
                            components={[<strong key={0} />]}
                        />
                    </Text>
                </li>
                <li className='mt5-notification-list-container-item'>
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='Re-add your MT5 account using the same log in credentials.' />
                    </Text>
                </li>
            </ol>
            <Text as='p' size='xs'>
                <Localize
                    i18n_default_text='If this doesn’t work, uninstall and re-install the MT5 app. Then redo steps <0>2</0> and <0>3</0>.'
                    components={[<strong key={0} />]}
                />
            </Text>
            <Text as='p' size='xs' className='mt5-notification-list-contact'>
                <Localize i18n_default_text='Need more help? Contact us through live chat for assistance.' />
            </Text>
        </div>
    );
};

export default MT5NotificationDescription;
