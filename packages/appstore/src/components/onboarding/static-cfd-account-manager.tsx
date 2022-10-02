import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { TPlatform } from 'Types';

import './static-cfd-account-manager.scss';
import classNames from 'classnames';

type TStaticCFDAccountManager = {
    type: string;
    appname: string;
    loginid?: string;
    currency?: string;
    description?: string;
    is_animated?: boolean;
    has_account?: boolean;
    derived_amount?: string;
    is_icon_blurry?: boolean;
    is_item_blurry?: boolean;
    is_text_blurry?: boolean;
    is_get_blurry?: boolean;
    is_topup_blurry?: boolean;
    is_trade_blurry?: boolean;
    financial_amount?: string;
    is_topup_animated?: boolean;
    is_trade_animated?: boolean;
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
    is_icon_blurry,
    is_get_blurry,
    is_item_blurry,
    derived_amount,
    is_trade_blurry,
    is_topup_blurry,
    financial_amount,
    is_trade_animated,
    is_topup_animated,
    is_button_animated,
}: TStaticCFDAccountManager) => {
    return (
        <div className='static-cfd-account-manager'>
            <div className='static-cfd-account-manager__icon'>
                {platform === CFD_PLATFORMS.MT5 &&
                    (type === 'financial' ? (
                        <WalletIcon
                            icon={'Financial'}
                            className={is_icon_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                        />
                    ) : (
                        <WalletIcon
                            icon={'Derived'}
                            className={is_icon_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                        />
                    ))}
                {platform === CFD_PLATFORMS.DXTRADE && (
                    <WalletIcon
                        icon={'DerivX'}
                        className={is_icon_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
                    />
                )}
                {platform === 'options' && (
                    <WalletIcon
                        icon={'Options'}
                        className={is_icon_blurry ? 'static-cfd-account-manager__icon--blurry' : ''}
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
                        <Button
                            secondary
                            className={classNames('static-cfd-account-manager__buttons-topup', {
                                'static-cfd-account-manager__buttons-topup--blurry': is_topup_blurry,
                                'static-cfd-account-manager__buttons-topup--animated': is_topup_animated,
                            })}
                        >
                            <Localize i18n_default_text='Top-up' />
                        </Button>
                        <Button
                            primary
                            className={classNames('static-cfd-account-manager__buttons-trade', {
                                'static-cfd-account-manager__buttons-trade--blurry': is_trade_blurry,
                                'static-cfd-account-manager__buttons-topup--animated': is_trade_animated,
                            })}
                        >
                            <Localize i18n_default_text='Trade' />
                        </Button>
                    </>
                ) : (
                    <Button
                        primary_light
                        className={classNames('', {
                            'static-cfd-account-manager__buttons--animated': is_button_animated,
                            'static-cfd-account-manager__buttons-get--blurry': is_get_blurry,
                        })}
                    >
                        <Localize i18n_default_text='Get' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default StaticCFDAccountManager;
