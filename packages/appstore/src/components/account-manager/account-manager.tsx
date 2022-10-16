import React from 'react';
import { Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS, getStaticUrl } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TPlatform } from 'Types';
import WalletIcon from 'Assets/svgs/wallet';

type TAccountManager = {
    type?: string;
    amount?: string;
    appname: string;
    loginid?: string;
    platform?: TPlatform;
    currency?: string;
    onClickTopUp?: () => void;
    onClickTrade?: () => void;
    onClickGet?: () => void;
    description?: string;
    has_account: boolean;
    disabled: boolean;
    dxtrade_link?: string;
};

const AccountManager = ({
    type,
    amount,
    appname,
    loginid,
    currency,
    platform,
    disabled,
    onClickGet,
    description,
    has_account,
    onClickTopUp,
    onClickTrade,
    dxtrade_link,
}: TAccountManager) => {
    const openStaticPage = () => {
        if (platform === CFD_PLATFORMS.MT5) window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (type === 'Options') window.open(getStaticUrl(`/trade-types/options/`));
    };

    return (
        <div className='account-manager'>
            <div className='account-manager__icon'>
                {platform === CFD_PLATFORMS.MT5 &&
                    (type === 'financial' ? (
                        <WalletIcon icon='Financial' size={64} onClick={openStaticPage} />
                    ) : (
                        <WalletIcon icon='Derived' size={64} onClick={openStaticPage} />
                    ))}
                {platform === CFD_PLATFORMS.DXTRADE && <WalletIcon icon='DerivX' size={64} onClick={openStaticPage} />}
                {!platform && type === 'Options' && <WalletIcon icon='Options' size={64} onClick={openStaticPage} />}
            </div>
            <div className='account-manager__details'>
                <Text
                    size='xs'
                    weight={!has_account ? 'bold' : 'normal'}
                    onClick={openStaticPage}
                    className='account-manager__details--title'
                >
                    {appname}
                </Text>
                {has_account ? (
                    <>
                        <Text size='xs' weight='bold'>{`${formatMoney(currency, amount, true)} ${currency}`}</Text>
                        <Text size='xs'>{loginid}</Text>
                    </>
                ) : (
                    <Text size='xxxs'>{description}</Text>
                )}
            </div>
            <div className='account-manager__buttons'>
                {has_account ? (
                    <>
                        <Button secondary className='account-manager__buttons-topup' onClick={onClickTopUp}>
                            <Localize i18n_default_text='Top-up' />
                        </Button>

                        {platform === CFD_PLATFORMS.DXTRADE && (
                            <a
                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                style={{ margin: '0', width: '100%', height: '3.4rem' }}
                                type='button'
                                href={dxtrade_link}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Localize i18n_default_text='Trade' />
                            </a>
                        )}
                        {platform === CFD_PLATFORMS.MT5 && (
                            <Button primary onClick={onClickTrade}>
                                <Localize i18n_default_text='Trade' />
                            </Button>
                        )}
                    </>
                ) : (
                    <Button
                        primary_light
                        className='account-manager__buttons-get'
                        onClick={onClickGet}
                        disabled={disabled}
                    >
                        <Localize i18n_default_text='Get' />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AccountManager;
