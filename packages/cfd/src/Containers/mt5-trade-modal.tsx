import React from 'react';
import {
    Button,
    Icon,
    DesktopWrapper,
    Div100vhContainer,
    Modal,
    MobileWrapper,
    Money,
    PageOverlay,
    Popover,
    Text,
    UILoader,
} from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { CFDAccountCopy } from '../Components/cfd-account-copy';
import { TAccountIconValues, TPasswordBoxProps, TTradingPlatformAccounts } from '../Components/props.types';
import { CFD_PLATFORMS, getCFDAccountDisplay, getCFDPlatformLabel, getUrlBase, getCFDAccountKey } from '@deriv/shared';
import { getPlatformMt5DownloadLink, getMT5WebTerminalLink } from '../Helpers/constants';

type TMT5TradeModalProps = {
    mt5_trade_account: Required<DetailsOfEachMT5Loginid>;
    disableApp: () => void;
    enableApp: () => void;
    is_eu_user: boolean;
    is_open: boolean;
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        arg3: string,
        arg4: string,
        arg5: string | undefined
    ) => void;
    toggleModal: () => void;
};

export type TSpecBoxProps = {
    value: string | undefined;
    is_bold?: boolean;
};

const PasswordBox = ({ platform, onClick }: TPasswordBoxProps) => (
    <div className='cfd-trade-modal__password-box'>
        <div className='cfd-trade-modal__password-text'>
            <Popover
                alignment='right'
                message={localize(
                    'Use these credentials to log in to your {{platform}} account on the website and mobile apps.',
                    {
                        platform: getCFDPlatformLabel(platform),
                    }
                )}
                classNameBubble='cfd-trade-modal__password-tooltip'
                zIndex={9999}
            >
                <Text size='xs'>***************</Text>
            </Popover>
        </div>
        <Popover
            className='cfd-trade-modal__password-popover'
            alignment='left'
            message={localize('Change Password')}
            relative_render
            zIndex={9999}
        >
            <Button
                className='cfd-trade-modal__password-action'
                transparent
                onClick={onClick}
                icon={
                    <Icon
                        icon='IcEdit'
                        className='da-article__learn-more-icon'
                        custom_color='var(--text-less-prominent)'
                    />
                }
            />
        </Popover>
    </div>
);

const SpecBox = ({ value, is_bold }: TSpecBoxProps) => (
    <div className='cfd-trade-modal__spec-box'>
        <Text size='xs' weight={is_bold ? 'bold' : ''} className='cfd-trade-modal__spec-text'>
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-trade-modal__spec-copy' />
    </div>
);

const account_icons: { [key: string]: TAccountIconValues } = {
    mt5: {
        synthetic: 'IcMt5SyntheticPlatform',
        financial: 'IcMt5FinancialPlatform',
        cfd: 'IcMt5CfdPlatform',
    },
};

const getTitle = (market_type: string, is_eu_user: boolean) => {
    if (is_eu_user) localize('MT5 CFDs');
    return market_type;
};

const MT5TradeModal = ({
    mt5_trade_account,
    disableApp,
    enableApp,
    is_eu_user,
    is_open,
    onPasswordManager,
    toggleModal,
}: TMT5TradeModalProps) => {
    const getCompanyShortcode = () => {
        if (
            (mt5_trade_account.account_type === 'demo' &&
                mt5_trade_account.market_type === 'financial' &&
                mt5_trade_account.landing_company_short === 'labuan') ||
            mt5_trade_account.account_type === 'real'
        ) {
            return mt5_trade_account.landing_company_short;
        }
        return undefined;
    };
    const getHeadingTitle = () =>
        getCFDAccountDisplay({
            market_type: mt5_trade_account.market_type,
            sub_account_type: mt5_trade_account.sub_account_type,
            platform: CFD_PLATFORMS.MT5,
            is_eu: is_eu_user,
            shortcode: getCompanyShortcode(),
            is_mt5_trade_modal: true,
        });
    const getPageContent = () => (
        <div className='cfd-trade-modal-container'>
            <div className='cfd-trade-modal'>
                <Icon icon={account_icons.mt5[is_eu_user ? 'cfd' : mt5_trade_account.market_type]} size={24} />
                <div className='cfd-trade-modal__desc'>
                    <Text size='xs' line_height='l' className='cfd-trade-modal__desc-heading'>
                        {getHeadingTitle()}
                    </Text>
                    {(mt5_trade_account as TTradingPlatformAccounts)?.display_login && (
                        <Text color='less-prominent' size='xxxs' line_height='xxxs'>
                            {(mt5_trade_account as TTradingPlatformAccounts)?.display_login}
                        </Text>
                    )}
                </div>
                {mt5_trade_account?.display_balance && (
                    <Text size='xs' color='profit-success' className='cfd-trade-modal__desc-balance' weight='bold'>
                        <Money
                            amount={mt5_trade_account.display_balance}
                            currency={mt5_trade_account.currency}
                            has_sign={!!mt5_trade_account.balance && mt5_trade_account.balance < 0}
                            show_currency
                        />
                    </Text>
                )}
            </div>
            <div className='cfd-trade-modal__login-specs'>
                <div className='cfd-trade-modal__login-specs-item'>
                    <Text className='cfd-trade-modal--paragraph'>{localize('Broker')}</Text>
                    <SpecBox value={'Deriv Limited'} />
                </div>
                <div className='cfd-trade-modal__login-specs-item'>
                    <Text className='cfd-trade-modal--paragraph'>{localize('Server')}</Text>
                    <SpecBox value={(mt5_trade_account as DetailsOfEachMT5Loginid)?.server_info?.environment} />
                </div>
                <div className='cfd-trade-modal__login-specs-item'>
                    <Text className='cfd-trade-modal--paragraph'>{localize('Login ID')}</Text>
                    <SpecBox value={(mt5_trade_account as TTradingPlatformAccounts)?.display_login} />
                </div>
                <div className='cfd-trade-modal__login-specs-item'>
                    <Text className='cfd-trade-modal--paragraph'>{localize('Password')}</Text>
                    <div className='cfd-trade-modal--paragraph'>
                        <PasswordBox
                            platform='mt5'
                            onClick={() => {
                                const account_type = getCFDAccountKey({
                                    market_type: mt5_trade_account.market_type,
                                    sub_account_type: mt5_trade_account.sub_account_type,
                                    platform: CFD_PLATFORMS.DMT5,
                                    shortcode: mt5_trade_account.landing_company_short,
                                });
                                onPasswordManager(
                                    mt5_trade_account?.login,
                                    getTitle(mt5_trade_account.market_type, is_eu_user),
                                    mt5_trade_account.account_type,
                                    account_type,
                                    (mt5_trade_account as DetailsOfEachMT5Loginid)?.server
                                );
                                toggleModal();
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='cfd-trade-modal__download-center-app'>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Icon icon='IcMt5Logo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 web')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={getMT5WebTerminalLink({
                            category: mt5_trade_account.account_type,
                            loginid: (mt5_trade_account as TTradingPlatformAccounts).display_login,
                            server_name: (mt5_trade_account as DetailsOfEachMT5Loginid)?.server_info?.environment,
                        })}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold'>
                            {localize('Open')}
                        </Text>
                    </a>
                </div>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Icon icon='IcWindowsLogo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 Windows app')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={getPlatformMt5DownloadLink('windows')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold'>
                            {localize('Download')}
                        </Text>
                    </a>
                </div>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Icon icon='IcMacosLogo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 MacOS app')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={getPlatformMt5DownloadLink('macos')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold'>
                            {localize('Download')}
                        </Text>
                    </a>
                </div>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Icon icon='IcLinuxLogo' size={32} />
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {localize('MetaTrader 5 Linux app')}
                    </Text>
                    <a
                        className='dc-btn cfd-trade-modal__download-center-app--option-link'
                        type='button'
                        href={getPlatformMt5DownloadLink('linux')}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Text size='xxs' weight='bold'>
                            {localize('Learn more')}
                        </Text>
                    </a>
                </div>
            </div>
            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>
                    <a href={getPlatformMt5DownloadLink('android')} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationGoogle' width={135} height={40} />
                    </a>
                    <a href={getPlatformMt5DownloadLink('huawei')} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationHuawei' width={135} height={40} />
                    </a>
                </div>
                <div className='cfd-trade-modal__download-center-options--qrcode'>
                    <img src={getUrlBase('/public/images/common/mt5_download.png')} width={80} height={80} />
                    <Text align='center' size='xxs'>
                        {localize('Scan the QR code to download Deriv MT5.')}
                    </Text>
                </div>
            </div>
        </div>
    );

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_open}
                    title='Trade'
                    toggleModal={toggleModal}
                    should_header_stick_body={false}
                    width='600px'
                    height='709px'
                    exit_classname='cfd-modal--custom-exit'
                >
                    {getPageContent()}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    className='cfd-trade-modal__mobile-view'
                    is_open={is_open}
                    portal_id='deriv_app'
                    header='Trade'
                    onClickClose={toggleModal}
                >
                    <Div100vhContainer className='cfd-trade-modal__mobile-view-wrapper' height_offset='80px'>
                        {getPageContent()}
                    </Div100vhContainer>
                </PageOverlay>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default connect(({ modules, ui }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    mt5_trade_account: modules.cfd.mt5_trade_account,
}))(MT5TradeModal);
