import React from 'react';
import { Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS, getStaticUrl, isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TPlatform, TRootStore } from 'Types';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { useStores } from 'Stores/index';

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
    const { client }: TRootStore = useStores();
    const { is_eu } = client;
    const icon_size = isMobile() ? 48 : 64;
    const eu_financial_icon = is_eu ? (
        <TradigPlatformIconProps icon='CFDs' size={icon_size} onClick={openStaticPage} />
    ) : (
        <TradigPlatformIconProps icon='Financial' size={icon_size} onClick={openStaticPage} />
    );

    return (
        <div className='account-manager'>
            <div className='account-manager__icon'>
                {platform === CFD_PLATFORMS.MT5 &&
                    (type === 'financial' ? (
                        eu_financial_icon
                    ) : (
                        <TradigPlatformIconProps icon='Derived' size={icon_size} onClick={openStaticPage} />
                    ))}
                {platform === CFD_PLATFORMS.DXTRADE && (
                    <TradigPlatformIconProps icon='DerivX' size={icon_size} onClick={openStaticPage} />
                )}
                {!platform && type === 'Options' && (
                    <TradigPlatformIconProps icon='Options' size={icon_size} onClick={openStaticPage} />
                )}
            </div>
            <div className='account-manager__details'>
                <Text
                    size={isMobile() ? 'xxs' : 'xs'}
                    weight={!has_account ? 'bold' : 'normal'}
                    onClick={openStaticPage}
                    className='account-manager__details--title'
                >
                    {appname}
                </Text>
                {has_account ? (
                    <React.Fragment>
                        <Text size='xs' weight='bold'>{`${formatMoney(currency, amount, true)} ${currency}`}</Text>
                        <Text size='xs'>{loginid}</Text>
                    </React.Fragment>
                ) : (
                    <Text size='xxxs'>{description}</Text>
                )}
            </div>
            <div className='account-manager__buttons'>
                {has_account ? (
                    <React.Fragment>
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
                    </React.Fragment>
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
