import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import { TPlatform } from 'Types';

import './static-cfd-account-manager.scss';

type TStaticCFDAccountManager = {
    type: string;
    amount?: string;
    appname: string;
    loginid?: string;
    currency?: string;
    is_blurry?: boolean;
    platform: TPlatform;
    description?: string;
    has_account?: boolean;
};

const StaticCFDAccountManager = ({
    type,
    amount,
    appname,
    loginid,
    currency,
    platform,
    is_blurry,
    has_account,
    description,
}: TStaticCFDAccountManager) => {
    return (
        <div className='static-cfd-account-manager'>
            <div className='static-cfd-account-manager__icon'>
                {platform === CFD_PLATFORMS.MT5 &&
                    (type === 'financial' ? (
                        <Icon icon='IcAppstoreFinancial' size={64} />
                    ) : (
                        <Icon icon='IcAppstoreDerived' size={64} />
                    ))}
                {platform === CFD_PLATFORMS.DXTRADE && <Icon icon='IcAppstoreDerivx' size={64} />}
            </div>
            <div className='static-cfd-account-manager__details'>
                <Text size='xs' weight='bold' color={is_blurry ? 'less-prominent' : 'prominent'}>
                    {appname}
                </Text>
                {has_account ? (
                    <>
                        <Text size='xs'>{`${formatMoney(currency, amount, true)} ${currency}`}</Text>
                        <Text size='xs'>{loginid}</Text>
                    </>
                ) : (
                    <Text size='xxxs'>{description}</Text>
                )}
            </div>
            <div className='static-cfd-account-manager-buttons'>
                {has_account ? (
                    <>
                        <Button primary className='static-cfd-account-manager__buttons-topup'>
                            <Localize i18n_default_text='Top-up' />
                        </Button>
                        <Button secondary>
                            <Localize i18n_default_text='Trade' />
                        </Button>
                    </>
                ) : (
                    <Button>
                        <Localize i18n_default_text='Get' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default StaticCFDAccountManager;
