import React from 'react';

import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Icon, Money, Text, ExpansionPanel } from '@deriv/components';
import { getCFDAccountKey, isMobile, mobileOSDetect } from '@deriv/shared';
import { TCFDDashboardContainer, TCFDsPlatformType, TTradingPlatformAccounts } from 'Components/props.types';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';
import PasswordBox from '../Components/passwordbox';
import SpecBox from '../Components/specbox';
import { getPlatformQRCode, mobileDownloadLink, PlatformsDesktopDownload } from '../Helpers/config';
import { CTRADER_DESKTOP_DOWNLOAD, getTitle, platformsText } from '../Helpers/constants';

import { TCFDPasswordReset } from './props.types';
import { ctrader } from '@deriv/components/src/components/icon/icons-manifest';

type TTradeModalProps = {
    ctrader_dxtrade_trade_account: Required<DetailsOfEachMT5Loginid>;
    is_eu_user: boolean;
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        group: TCFDPasswordReset['account_group'],
        arg4: string,
        arg5: string | undefined
    ) => void;
    toggleModal: () => void;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    ctrader_tokens: TCFDDashboardContainer['ctrader_tokens'];
    is_demo: string;
    platform: TCFDsPlatformType;
    is_mobile?: boolean;
};

const PlatformIconsAndDescriptions = (
    platform: TCFDsPlatformType,
    is_demo: string,
    mt5_trade_account: Required<DetailsOfEachMT5Loginid>
) => {
    return (
        <React.Fragment>
            <Icon icon={`IcRebranding${platform.charAt(0).toUpperCase()}${platform.slice(1)}Dashboard`} size={24} />
            <div className='cfd-trade-modal__desc'>
                <Text size='xs' line_height='l' className='cfd-trade-modal__desc-heading'>
                    <Localize
                        i18n_default_text='Deriv {{platform}} <0>{{is_demo}}</0>'
                        values={{
                            platform: platformsText(platform),
                            is_demo: is_demo ? 'Demo' : '',
                        }}
                        components={[
                            <span
                                key={0}
                                className={platform === CFD_PLATFORMS.CTRADER && is_demo ? 'cfd-trade-modal--tag' : ''}
                            />,
                        ]}
                    />
                </Text>
                {(mt5_trade_account as TTradingPlatformAccounts)?.display_login &&
                    platform !== CFD_PLATFORMS.CTRADER && (
                        <Text color='less-prominent' size='xxxs' line_height='xxxs'>
                            {(mt5_trade_account as TTradingPlatformAccounts)?.display_login}
                        </Text>
                    )}
            </div>
        </React.Fragment>
    );
};

const CTraderDerivXTradeModal = ({
    ctrader_dxtrade_trade_account,
    is_eu_user,
    onPasswordManager,
    toggleModal,
    dxtrade_tokens,
    ctrader_tokens,
    is_demo,
    platform,
    is_mobile,
}: TTradeModalProps) => {
    const {
        ui,
        client,
        common,
        traders_hub,
        modules: { cfd },
    } = useStore();

    const { ctrader_accounts_list } = client;
    const { setAccountType, toggleMT5TradeModal } = cfd;
    const { setAppstorePlatform } = common;
    const { openDerivRealAccountNeededModal } = ui;
    const { selected_account_type, no_CR_account, is_real, has_any_real_account, getAccount } = traders_hub;

    const has_no_real_account = !has_any_real_account;

    const message = {
        header: (
            <Text as='h2' weight='bold' className='cfd-trade-modal__expansion-panel--header'>
                {localize('See important notes')}
            </Text>
        ),
        content: (
            <React.Fragment>
                <Text size='xxs' line_height='xxl' className='cfd-trade-modal__expansion-panel--content'>
                    {localize('Use your Deriv account email and password to log in to cTrader.')}
                </Text>
                <div className='cfd-trade-modal__expansion-panel--divider' />
                <Text size='xxs' line_height='xxl' className='cfd-trade-modal__expansion-panel--content'>
                    {localize(
                        'Manage up to 5 Deriv cTrader accounts (up to 4 strategy accounts and 1 non-strategy account for payouts and commissions).'
                    )}
                </Text>
                <div className='cfd-trade-modal__expansion-panel--divider' />
                <Text size='xxs' line_height='xxl' className='cfd-trade-modal__expansion-panel--content'>
                    {localize('Keep 1 non-strategy account open to manage deposits, withdrawals, and commissions.')}
                </Text>
            </React.Fragment>
        ),
    };

    const downloadCenterDescription = () => {
        switch (platform) {
            case 'dxtrade':
                return (
                    <Text
                        align='center'
                        as='p'
                        className='cfd-trade-modal__download-center-text'
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        weight='bold'
                    >
                        {localize('Download Deriv X on your phone to trade with the Deriv X account')}
                    </Text>
                );
            case 'ctrader':
                return (
                    <Text
                        align='center'
                        as='p'
                        className='cfd-trade-modal__download-center-text'
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        weight='bold'
                    >
                        {localize('Download cTrader on your phone to trade with the Deriv cTrader account')}
                    </Text>
                );
            default:
                return '';
        }
    };

    const downloadCenterAppOption = (platform_type: TCFDsPlatformType) => {
        let app_title = '';
        if (platform_type === 'dxtrade') {
            app_title = localize('Run Deriv X on your browser');
        } else if (platform_type === 'ctrader' && !is_mobile) {
            app_title = localize('Run cTrader on your browser');
        } else if (platform_type === 'ctrader' && is_mobile) {
            return null;
        } else {
            return null;
        }

        return (
            <React.Fragment>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {app_title}
                    </Text>
                    <PlatformsDesktopDownload
                        platform={platform}
                        is_demo={is_demo}
                        dxtrade_tokens={dxtrade_tokens}
                        ctrader_tokens={ctrader_tokens}
                    />
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className='cfd-trade-modal-container'>
            <div className='cfd-trade-modal'>
                {PlatformIconsAndDescriptions(platform, is_demo, ctrader_dxtrade_trade_account)}
                {ctrader_dxtrade_trade_account?.display_balance && (
                    <div className='cfd-trade-modal__balance'>
                        {platform === CFD_PLATFORMS.CTRADER && <Text size='xxs'>{localize('Total balance:')}</Text>}
                        <Text
                            size='xs'
                            color={platform !== CFD_PLATFORMS.CTRADER ? 'profit-success' : 'prominent'}
                            className='cfd-trade-modal__desc-balance'
                            weight='bold'
                        >
                            <Money
                                amount={ctrader_dxtrade_trade_account.display_balance}
                                currency={ctrader_dxtrade_trade_account.currency}
                                has_sign={
                                    !!ctrader_dxtrade_trade_account.balance && ctrader_dxtrade_trade_account.balance < 0
                                }
                                show_currency
                            />
                        </Text>
                    </div>
                )}
            </div>
            <div className='cfd-trade-modal__login-specs'>
                {platform === CFD_PLATFORMS.DXTRADE && (
                    <React.Fragment>
                        <div className='cfd-trade-modal__login-specs-item'>
                            <Text className='cfd-trade-modal--paragraph'>{localize('Username')}</Text>
                            <SpecBox
                                is_bold
                                value={(ctrader_dxtrade_trade_account as TTradingPlatformAccounts)?.login}
                            />
                        </div>
                        <div className='cfd-trade-modal__login-specs-item'>
                            <Text className='cfd-trade-modal--paragraph'>{localize('Password')}</Text>
                            <div className='cfd-trade-modal--paragraph'>
                                <PasswordBox
                                    platform='dxtrade'
                                    onClick={() => {
                                        const account_type = getCFDAccountKey({
                                            market_type: ctrader_dxtrade_trade_account.market_type,
                                            sub_account_type: ctrader_dxtrade_trade_account.sub_account_type,
                                            platform: CFD_PLATFORMS.MT5,
                                            shortcode: ctrader_dxtrade_trade_account.landing_company_short,
                                        });
                                        onPasswordManager(
                                            ctrader_dxtrade_trade_account?.login,
                                            getTitle(ctrader_dxtrade_trade_account.market_type, is_eu_user),
                                            ctrader_dxtrade_trade_account.account_type,
                                            account_type,
                                            (ctrader_dxtrade_trade_account as DetailsOfEachMT5Loginid)?.server
                                        );
                                        toggleModal();
                                    }}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {platform === CFD_PLATFORMS.CTRADER && (
                    <React.Fragment>
                        {ctrader_accounts_list.map(ctrader_account => {
                            return (
                                <div key={ctrader_account.login} className='cfd-trade-modal__list-of-accounts'>
                                    <Text size='xxs'>{ctrader_account.login}</Text>
                                    <Text size='xxs' weight='bold'>
                                        <Money
                                            amount={ctrader_account.balance}
                                            currency={ctrader_account.currency}
                                            has_sign={!!ctrader_account.balance && ctrader_account.balance < 0}
                                            show_currency
                                        />
                                    </Text>
                                </div>
                            );
                        })}
                        <div
                            className='cfd-trade-modal__get-more-accounts'
                            onClick={() => {
                                toggleMT5TradeModal();
                                if ((has_no_real_account || no_CR_account) && is_real) {
                                    openDerivRealAccountNeededModal();
                                } else {
                                    setAccountType({
                                        category: selected_account_type,
                                        type: 'all',
                                    });
                                    setAppstorePlatform(CFD_PLATFORMS.CTRADER);
                                    getAccount();
                                }
                            }}
                        >
                            <div>
                                <Icon
                                    icon={'IcAppstoreGetMoreAccounts'}
                                    size={24}
                                    className='cfd-trade-modal-get-more-accounts__icon'
                                />
                            </div>
                            <div className='cfd-trade-modal-get-more-accounts__details'>
                                <Text size='xxs'>{localize('Get another cTrader account')}</Text>
                            </div>
                        </div>

                        <div className='cfd-trade-modal__expansion-panel'>
                            <ExpansionPanel message={message} />
                        </div>
                    </React.Fragment>
                )}

                <div className='cfd-trade-modal__maintenance'>
                    <Icon
                        icon='IcAlertWarning'
                        size={isMobile() ? 28 : 24}
                        className='cfd-trade-modal__maintenance-icon'
                    />
                    <div className='cfd-trade-modal__maintenance-text'>
                        <Text size='xxxs' className='cfd-trade-modal__maintenance-text'>
                            {platform === CFD_PLATFORMS.DXTRADE && (
                                <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.' />
                            )}
                            {platform === CFD_PLATFORMS.MT5 && (
                                <Localize i18n_default_text='Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                            )}
                            {platform === CFD_PLATFORMS.CTRADER && (
                                <Localize i18n_default_text='Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.' />
                            )}
                        </Text>
                    </div>
                </div>
            </div>
            <div className='cfd-trade-modal__download-center-app'>{downloadCenterAppOption(platform)}</div>
            {platform === CFD_PLATFORMS.CTRADER && (
                <React.Fragment>
                    {!is_mobile && (
                        <div className='cfd-trade-modal__download-center-app--windows'>
                            <Icon icon='IcWindowsLogo' size={32} />
                            <Text className='cfd-trade-modal__download-center-app--windows-item' size='xs'>
                                {localize('cTrader Windows app')}
                            </Text>
                            <a
                                className='dc-btn cfd-trade-modal__download-center-app--windows-link'
                                type='button'
                                href={CTRADER_DESKTOP_DOWNLOAD}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Text size='xxs' weight='bold' color='prominent'>
                                    {localize('Download')}
                                </Text>
                            </a>
                        </div>
                    )}
                    {is_mobile && mobileOSDetect() === 'iOS' && (
                        <div className='cfd-trade-modal__download-center-app-ctrader-container'>
                            <Text
                                className='cfd-trade-modal__download-center-app-ctrader__banner-text'
                                align='center'
                                size='xs'
                                weight='bold'
                            >
                                <Localize i18n_default_text='Coming soon on IOS' />
                            </Text>
                            <Text
                                className='cfd-trade-modal__download-center-app-ctrader__banner-text'
                                align='center'
                                size='xxs'
                            >
                                <Localize i18n_default_text='cTrader is only available on desktop for now.' />
                            </Text>
                        </div>
                    )}
                </React.Fragment>
            )}
            {mobileOSDetect() !== 'iOS' && (
                <div className='cfd-trade-modal__download-center-description'>{downloadCenterDescription()}</div>
            )}

            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>
                    {platform !== CFD_PLATFORMS.CTRADER && (
                        <div className='cfd-trade-modal__download-center-options--mobile-links--apple'>
                            <a href={mobileDownloadLink(platform, 'ios')} target='_blank' rel='noopener noreferrer'>
                                <Icon icon='IcInstallationApple' width={isMobile() ? '160' : '130'} height={40} />
                            </a>
                        </div>
                    )}
                    {platform === CFD_PLATFORMS.CTRADER && mobileOSDetect() !== 'iOS' && (
                        <a href={mobileDownloadLink(platform, 'android')} target='_blank' rel='noopener noreferrer'>
                            <Icon icon='IcInstallationGoogle' width={135} height={40} />
                        </a>
                    )}
                    {platform !== CFD_PLATFORMS.CTRADER && (
                        <React.Fragment>
                            <a href={mobileDownloadLink(platform, 'android')} target='_blank' rel='noopener noreferrer'>
                                <Icon icon='IcInstallationGoogle' width={135} height={40} />
                            </a>

                            <a href={mobileDownloadLink(platform, 'huawei')} target='_blank' rel='noopener noreferrer'>
                                <Icon icon='IcInstallationHuawei' width={135} height={40} />
                            </a>
                        </React.Fragment>
                    )}
                </div>
                {!isMobile() && (
                    <div className='cfd-trade-modal__download-center-options--qrcode'>
                        {getPlatformQRCode(platform)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(CTraderDerivXTradeModal);
