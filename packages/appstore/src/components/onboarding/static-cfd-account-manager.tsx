import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TPlatform } from 'Types';

import './static-cfd-account-manager.scss';

type TStaticCFDAccountManager = {
    type: string;
    amount?: string;
    appname: string;
    loginid?: string;
    currency?: string;
    description?: string;
    is_animated?: boolean;
    has_account?: boolean;
    is_item_blurry?: boolean;
    is_text_blurry?: boolean;
    is_button_animated?: boolean;
    platform: TPlatform | 'options';
};

const StaticCFDAccountManager = ({
    type,
    amount,
    appname,
    loginid,
    currency,
    platform,
    has_account,
    description,
    is_item_blurry,
    is_button_animated,
}: TStaticCFDAccountManager) => {
    return (
        <div className='static-cfd-account-manager'>
            <div className='static-cfd-account-manager__icon'>
                {platform === CFD_PLATFORMS.MT5 &&
                    (type === 'financial' ? (
                        <Icon
                            icon='IcAppstoreFinancial'
                            size={64}
                            className={is_item_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                        />
                    ) : (
                        <Icon
                            icon='IcAppstoreDerived'
                            size={64}
                            className={is_item_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                        />
                    ))}
                {platform === CFD_PLATFORMS.DXTRADE && (
                    <Icon
                        icon='IcAppstoreDerivx'
                        size={64}
                        className={is_item_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                    />
                )}
                {platform === 'options' && (
                    <Icon
                        icon='IcAppstoreOptions'
                        size={64}
                        className={is_item_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                    />
                )}
            </div>
            <div className='static-cfd-account-manager__details'>
                <Text size='xs' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                    {appname}
                </Text>
                {has_account ? (
                    <>
                        <Text size='xs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>{`${formatMoney(
                            currency,
                            amount,
                            true
                        )} ${currency}`}</Text>
                        <Text size='xs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                            {loginid}
                        </Text>
                    </>
                ) : (
                    <Text size='xxxs' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                        {description}
                    </Text>
                )}
            </div>
            <div className='static-cfd-account-manager__buttons'>
                {has_account ? (
                    <>
                        <Button primary className='static-cfd-account-manager__buttons-topup'>
                            <Localize i18n_default_text='Top-up' />
                        </Button>
                        <Button secondary className='static-cfd-account-manager__buttons-trade'>
                            <Localize i18n_default_text='Trade' />
                        </Button>
                    </>
                ) : (
                    <Button className={is_button_animated ? 'static-cfd-account-manager__buttons--animated' : ''}>
                        <Localize i18n_default_text='Get' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default StaticCFDAccountManager;
