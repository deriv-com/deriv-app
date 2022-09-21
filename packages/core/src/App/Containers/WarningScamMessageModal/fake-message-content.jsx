import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getBrandName } from '@deriv/shared';

const FakeMessageContent = () => (
    <div className='fake-link__container'>
        <Icon icon='IcAccountCross' className='warning-scam-message__icon--cross' />
        <div className='fake-link__message-container'>
            <Text>
                <Localize
                    i18n_default_text={`Fake links often contain the word that looks like "{{ brandName }}" but look out for these differences.`}
                    values={{ brandName: getBrandName() }}
                />
            </Text>
            <div className='fake-link__link-container'>
                <Text align='center'>
                    <Localize i18n_default_text='Examples' />: https://dervd.com/auth
                </Text>
            </div>
        </div>
    </div>
);

export default FakeMessageContent;
