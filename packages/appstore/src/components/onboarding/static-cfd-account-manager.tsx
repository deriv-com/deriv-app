import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TPlatform } from 'Types';

import './static-cfd-account-manager.scss';

type TStaticCFDAccountManager = {
    type: string;
    appname: string;
    loginid?: string;
    currency?: string;
    description?: string;
    is_animated?: boolean;
    has_account?: boolean;
    derived_amount?: string;
    is_item_blurry?: boolean;
    is_text_blurry?: boolean;
    financial_amount?: string;
    is_button_animated?: boolean;
    platform: TPlatform | 'options';
};

const StaticCFDAccountManager = ({
    type,
    appname,
    loginid,
    currency,
    platform,
    has_account,
    description,
    is_item_blurry,
    derived_amount,
    financial_amount,
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
                            type === 'financial' ? financial_amount : derived_amount,
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
                {has_account && platform !== CFD_PLATFORMS.DXTRADE ? (
                    <>
                        <Button primary className='static-cfd-account-manager__buttons-topup'>
                            <Localize i18n_default_text='Top-up' />
                        </Button>
                        <Button secondary className='static-cfd-account-manager__buttons-trade'>
                            <Localize i18n_default_text='Trade' />
                        </Button>
                    </>
                ) : (
                    <Button
                        primary_light
                        className={is_button_animated ? 'static-cfd-account-manager__buttons--animated' : ''}
                    >
                        <Localize i18n_default_text='Get' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default StaticCFDAccountManager;
