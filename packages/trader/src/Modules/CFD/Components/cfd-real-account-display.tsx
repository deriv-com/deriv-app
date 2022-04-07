import React from 'react';
import classNames from 'classnames';
import { localize, Localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Carousel } from '@deriv/components';
import { getAccountTypeFields, getAccountListKey, getCFDAccountKey, CFD_PLATFORMS } from '@deriv/shared';
import specifications from 'Modules/CFD/Constants/cfd-specifications';
import { CFDAccountCard } from './cfd-account-card';
import { general_messages } from '../Constants/cfd-shared-strings';
import { DetailsOfEachMT5Loginid, ResidenceList, LandingCompany, GetSettings } from '@deriv/api-types';
import { TSpecifications } from '../Constants/cfd-specifications';
import { TExistingData } from './props.types.js';
import { TTradingPlatformAccounts } from './props.types';

type TStandPoint = {
    financial_company: string;
    gaming_company: string;
    iom: boolean;
    malta: boolean;
    maltainvest: boolean;
    svg: boolean;
};

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

type TCFDRealAccountDisplayProps = {
    has_real_account: boolean;
    is_accounts_switcher_on: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    has_malta_account: boolean;
    has_maltainvest_account: boolean;
    has_cfd_account_error: boolean;
    is_fully_authenticated: boolean;
    account_settings: GetSettings;
    openAccountNeededModal: (target: string, target_label: string, target_dmt5_label: string) => void;
    standpoint: TStandPoint;
    is_loading?: boolean;
    is_logged_in: boolean;
    isSyntheticCardVisible: (account_category: string) => boolean;
    is_pending_authentication: boolean;
    is_virtual: boolean;
    isFinancialCardVisible: () => boolean;
    isFinancialStpCardVisible: () => boolean;
    landing_companies: LandingCompany;
    onSelectAccount: (objCFDAccount: { category: string; type: string; set_password?: number }) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    platform: string;
    isAccountOfTypeDisabled: (
        account: Array<DetailsOfEachMT5Loginid> & { [key: string]: DetailsOfEachMT5Loginid | TTradingPlatformAccounts }
    ) => boolean;
    current_list: Array<DetailsOfEachMT5Loginid> & {
        [key: string]: DetailsOfEachMT5Loginid | TTradingPlatformAccounts;
    };
    has_cfd_account: boolean;
    openPasswordManager: (login?: string, title?: string, group?: string, type?: string, server?: string) => void;
    toggleAccountsDialog: (is_accounts_switcher_on?: boolean) => void;
    toggleShouldShowRealAccountsList: (is_should_show_real_acc_list?: boolean) => void;
    can_have_more_real_synthetic_mt5: boolean;
    residence: string;
    residence_list: ResidenceList;
    account_status?: object;
};

const getRealFinancialStpBtnLbl = (
    is_fully_authenticated: boolean,
    is_pending_authentication: boolean,
    has_required_credentials: boolean
) => {
    if (is_fully_authenticated && has_required_credentials) {
        return <Localize i18n_default_text='Set your password' />;
    } else if (is_pending_authentication) {
        return <Localize i18n_default_text='Pending verification' />;
    }

    return <Localize i18n_default_text='Add real account' />;
};

const CFDRealAccountDisplay = ({
    has_real_account,
    is_accounts_switcher_on,
    is_eu,
    is_eu_country,
    has_malta_account,
    has_maltainvest_account,
    has_cfd_account_error,
    is_fully_authenticated,
    is_pending_authentication,
    is_virtual,
    isSyntheticCardVisible,
    isFinancialCardVisible,
    isFinancialStpCardVisible,
    landing_companies,
    onSelectAccount,
    openAccountTransfer,
    openPasswordModal,
    isAccountOfTypeDisabled,
    current_list,
    has_cfd_account,
    openPasswordManager,
    account_settings,
    openAccountNeededModal,
    platform,
    standpoint,
    is_logged_in,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
    can_have_more_real_synthetic_mt5,
    residence,
    residence_list,
}: TCFDRealAccountDisplayProps) => {
    const should_show_trade_servers =
        is_logged_in &&
        !is_eu &&
        has_real_account &&
        can_have_more_real_synthetic_mt5 &&
        platform === CFD_PLATFORMS.MT5;
    const [active_hover, setActiveHover] = React.useState(0);

    const has_required_credentials = React.useMemo(() => {
        const { citizen, tax_identification_number, tax_residence } = account_settings;

        if (citizen && tax_identification_number && tax_residence) return true;

        if (citizen && tax_residence) {
            const is_tin_required = landing_companies?.config?.tax_details_required ?? false;
            return (
                is_tin_required ||
                !(residence_list as ResidenceList).filter(v => v.value === tax_residence && v.tin_format).length
            );
        }

        return false;
    }, [account_settings, residence_list, landing_companies]) as boolean;

    const button_label = getRealFinancialStpBtnLbl(
        is_fully_authenticated,
        is_pending_authentication,
        has_required_credentials
    );

    const is_eu_user = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    const is_real_financial_stp_disabled = !has_real_account || is_pending_authentication;

    const financial_specs = React.useMemo(() => {
        const should_show_eu = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
        const is_australian = residence === 'au';
        if (is_australian) {
            return specifications[platform as keyof TSpecifications].au_real_financial_specs;
        }
        if (should_show_eu) {
            return specifications[platform as keyof TSpecifications].eu_real_financial_specs;
        }
        return specifications[platform as keyof TSpecifications].real_financial_specs;
    }, [residence, is_logged_in, is_eu, is_eu_country, platform]);

    const onSelectRealSynthetic = () => {
        if (is_eu && standpoint.malta && !has_malta_account) {
            openAccountNeededModal('malta', localize('Deriv Synthetic'), localize('DMT5 Synthetic'));
        } else {
            onSelectAccount({ type: 'synthetic', category: 'real' });
        }
    };
    const onSelectRealFinancial = () => {
        if (is_eu && !has_maltainvest_account) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('real CFDs'));
        } else {
            onSelectAccount({ type: 'financial', category: 'real' });
        }
    };
    const onSelectRealFinancialStp = () => {
        const account_type = {
            category: 'real',
            type: 'financial_stp',
        };
        if (is_fully_authenticated && has_required_credentials) {
            openPasswordModal(account_type);
        } else if ((!is_fully_authenticated && !is_real_financial_stp_disabled) || !has_required_credentials) {
            onSelectAccount(account_type);
        }
    };

    const onClickFundReal = (account: TExistingData) =>
        openAccountTransfer(current_list[getAccountListKey(account, platform)], {
            category: account.account_type as keyof TOpenAccountTransferMeta,
            type: getCFDAccountKey({
                market_type: account.market_type,
                sub_account_type: (account as DetailsOfEachMT5Loginid).sub_account_type,
                platform,
            }),
        });

    const handleHoverCard = (name: string | undefined) => {
        const real_synthetic_accounts_list = Object.keys(current_list).filter(key =>
            key.startsWith(`${platform}.real.synthetic`)
        );
        setActiveHover(
            (real_synthetic_accounts_list as Array<string>).findIndex(
                t => (current_list[t] as DetailsOfEachMT5Loginid).group === name
            )
        );
    };

    const isMT5AccountCardDisabled = (sub_account_type: string) => {
        if (has_cfd_account_error) return true;

        if (sub_account_type === 'synthetic' && standpoint.malta) return true;

        if (is_eu) {
            const account = getAccountTypeFields({ category: 'real', type: sub_account_type });
            return isAccountOfTypeDisabled(account?.account_type);
        }

        switch (sub_account_type) {
            case 'synthetic':
            case 'financial':
                return !has_real_account;
            case 'financial_stp':
                return is_real_financial_stp_disabled;
            default:
                return false;
        }
    };

    const synthetic_account_items =
        isSyntheticCardVisible('real') &&
        (Object.keys(current_list).some(key => key.startsWith(`${platform}.real.synthetic`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.real.synthetic`))
                  .reduce((acc, cur) => {
                      acc.push(current_list[cur]);
                      return acc;
                  }, [] as DetailsOfEachMT5Loginid[])
                  .map((acc, index) => {
                      return (
                          <CFDAccountCard
                              key={index}
                              has_cfd_account={has_cfd_account}
                              has_cfd_account_error={has_cfd_account_error}
                              title={localize('Synthetic')}
                              is_hovered={index === active_hover}
                              is_disabled={isMT5AccountCardDisabled('synthetic')}
                              type={{
                                  category: 'real',
                                  type: 'synthetic',
                                  platform,
                              }}
                              is_logged_in={is_logged_in}
                              should_show_trade_servers={should_show_trade_servers}
                              existing_data={acc}
                              commission_message={localize('No commission')}
                              onSelectAccount={onSelectRealSynthetic}
                              onPasswordManager={openPasswordManager}
                              onClickFund={onClickFundReal}
                              platform={platform}
                              descriptor={localize(
                                  'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                              )}
                              specs={specifications[platform as keyof TSpecifications].real_synthetic_specs}
                              onHover={handleHoverCard}
                          />
                      );
                  })
            : [
                  <CFDAccountCard
                      key='real.synthetic'
                      has_cfd_account={has_cfd_account}
                      title={localize('Synthetic')}
                      is_disabled={isMT5AccountCardDisabled('synthetic')}
                      type={{
                          category: 'real',
                          type: 'synthetic',
                          platform,
                      }}
                      is_logged_in={is_logged_in}
                      should_show_trade_servers={should_show_trade_servers}
                      existing_data={undefined}
                      commission_message={localize('No commission')}
                      onSelectAccount={onSelectRealSynthetic}
                      onPasswordManager={openPasswordManager}
                      onClickFund={onClickFundReal}
                      platform={platform}
                      descriptor={localize(
                          'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                      )}
                      specs={specifications[platform as keyof TSpecifications].real_synthetic_specs}
                      onHover={handleHoverCard}
                      is_virtual={is_virtual}
                      toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
                      toggleAccountsDialog={toggleAccountsDialog}
                  />,
              ]);

    const financial_stp_account = isFinancialStpCardVisible() && (
        <CFDAccountCard
            key='real.financial_stp'
            has_cfd_account={has_cfd_account}
            title={localize('Financial STP')}
            type={{
                category: 'real',
                type: 'financial_stp',
                platform,
            }}
            is_logged_in={is_logged_in}
            existing_data={
                current_list[
                    Object.keys(current_list).find((key: string) =>
                        key.startsWith(`${platform}.real.financial_stp@`)
                    ) || ''
                ]
            }
            commission_message={localize('No commission')}
            onSelectAccount={onSelectRealFinancialStp}
            button_label={button_label}
            is_button_primary={is_pending_authentication}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            platform={platform}
            descriptor={localize(
                'Trade popular currency pairs and cryptocurrencies with straight-through processing order (STP).'
            )}
            specs={(specifications as TSpecifications)[platform as keyof TSpecifications].real_financial_stp_specs}
            is_disabled={isMT5AccountCardDisabled('financial_stp')}
            is_virtual={is_virtual}
            has_real_account={has_real_account}
            toggleAccountsDialog={toggleAccountsDialog}
            toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            is_accounts_switcher_on={is_accounts_switcher_on}
        />
    );

    const financial_account = isFinancialCardVisible() && (
        <CFDAccountCard
            key='real.financial'
            has_cfd_account={has_cfd_account}
            is_disabled={isMT5AccountCardDisabled('financial')}
            title={is_eu_user ? localize('CFDs') : localize('Financial')}
            type={{
                category: 'real',
                type: 'financial',
                platform,
            }}
            existing_data={
                current_list[
                    Object.keys(current_list).find((key: string) => key.startsWith(`${platform}.real.financial@`)) || ''
                ]
            }
            commission_message={localize('No commission')}
            onSelectAccount={onSelectRealFinancial}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            platform={platform}
            descriptor={general_messages.getFinancialAccountDescriptor(platform, is_eu_user)}
            specs={financial_specs}
            is_eu={is_eu_user}
            is_logged_in={is_logged_in}
            is_virtual={is_virtual}
            toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            toggleAccountsDialog={toggleAccountsDialog}
        />
    );

    const items = [...(synthetic_account_items || []), financial_account, financial_stp_account].filter(Boolean);

    return (
        <div
            className={classNames('cfd-real-accounts-display', {
                'cfd-real-accounts-display--has-trade-servers': should_show_trade_servers,
            })}
        >
            <DesktopWrapper>
                <Carousel
                    list={items}
                    width={328}
                    nav_position='middle'
                    show_bullet={false}
                    item_per_window={3}
                    is_mt5={true}
                />
            </DesktopWrapper>
            <MobileWrapper>
                {items.map(item => {
                    return item;
                })}
            </MobileWrapper>
        </div>
    );
};

export { CFDRealAccountDisplay };
