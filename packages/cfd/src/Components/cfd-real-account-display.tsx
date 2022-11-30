import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Carousel } from '@deriv/components';
import { getAccountTypeFields, getAccountListKey, getCFDAccountKey } from '@deriv/shared';
import specifications, { TSpecifications } from '../Constants/cfd-specifications';
import { CFDAccountCard } from './cfd-account-card';
import { general_messages } from '../Constants/cfd-shared-strings';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { TTradingPlatformAccounts, TCFDPlatform } from './props.types';
import { TObjectCFDAccount } from '../Containers/cfd-dashboard';

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

type TCurrentList = DetailsOfEachMT5Loginid & {
    enabled: number;
};

type TCFDRealAccountDisplayProps = {
    has_real_account: boolean;
    is_accounts_switcher_on: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    has_cfd_account_error: boolean;
    standpoint: TStandPoint;
    is_loading?: boolean;
    is_logged_in: boolean;
    isSyntheticCardVisible: (account_category: string) => boolean;
    is_virtual: boolean;
    isFinancialCardVisible: () => boolean;
    onSelectAccount: (objCFDAccount: TObjectCFDAccount) => void;
    realSyntheticAccountsExistingData: (getRealExistingData: DetailsOfEachMT5Loginid[] | undefined) => void;
    realFinancialAccountsExistingData: (getRealExistingData: DetailsOfEachMT5Loginid[] | undefined) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    platform: TCFDPlatform;
    isAccountOfTypeDisabled: (
        account: Array<DetailsOfEachMT5Loginid> & { [key: string]: DetailsOfEachMT5Loginid }
    ) => boolean;
    // TODO: update this type (DetailsOfEachMT5Loginid) when BE changed the schema
    current_list: Record<string, TCurrentList>;
    openPasswordManager: (login?: string, title?: string, group?: string, type?: string, server?: string) => void;
    toggleAccountsDialog: (is_accounts_switcher_on?: boolean) => void;
    toggleMT5TradeModal: (is_accounts_switcher_on?: boolean) => void;
    toggleShouldShowRealAccountsList: (is_should_show_real_acc_list?: boolean) => void;
    residence: string;
    account_status?: object;
    openDerivRealAccountNeededModal: () => void;
    should_enable_add_button?: boolean;
    setIsAcuityModalOpen: (value: boolean) => void;
    real_account_creation_unlock_date: string;
    setShouldShowCooldownModal: (value: boolean) => void;
};

const CFDRealAccountDisplay = ({
    has_real_account,
    is_accounts_switcher_on,
    is_eu,
    is_eu_country,
    has_cfd_account_error,
    is_virtual,
    isSyntheticCardVisible,
    isFinancialCardVisible,
    onSelectAccount,
    realSyntheticAccountsExistingData,
    realFinancialAccountsExistingData,
    openAccountTransfer,
    isAccountOfTypeDisabled,
    current_list,
    openPasswordManager,
    platform,
    standpoint,
    is_logged_in,
    toggleAccountsDialog,
    toggleMT5TradeModal,
    toggleShouldShowRealAccountsList,
    residence,
    openDerivRealAccountNeededModal,
    should_enable_add_button,
    setIsAcuityModalOpen,
    real_account_creation_unlock_date,
    setShouldShowCooldownModal,
}: TCFDRealAccountDisplayProps) => {
    const is_eu_user = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

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

    const onSelectRealAccount = (type: string) => {
        if (should_enable_add_button) {
            openDerivRealAccountNeededModal();
        } else {
            onSelectAccount({ type, category: 'real', platform });
        }
    };

    const onClickFundReal = (account: DetailsOfEachMT5Loginid) => {
        if (platform === 'dxtrade') {
            return openAccountTransfer(current_list[getAccountListKey(account, platform)], {
                category: account.account_type as keyof TOpenAccountTransferMeta,
                type: getCFDAccountKey({
                    market_type: account.market_type,
                    sub_account_type: (account as DetailsOfEachMT5Loginid).sub_account_type,
                    platform,
                }),
            });
        }
        return openAccountTransfer(account, {
            category: account.account_type as keyof TOpenAccountTransferMeta,
            type: getCFDAccountKey({
                market_type: account.market_type,
                sub_account_type: (account as DetailsOfEachMT5Loginid).sub_account_type,
                platform: 'mt5',
            }),
        });
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
                return should_enable_add_button ? false : !has_real_account;
            default:
                return false;
        }
    };

    const existing_accounts_data = (acc_type: 'synthetic' | 'financial') => {
        // We need to check enabled property for DXTRADE accounts only.
        // TODO: This condition should be removed after separating the DXTRADE and MT5 component.
        const should_be_enabled = (list_item: TCurrentList) =>
            platform === 'dxtrade' ? list_item.enabled === 1 : true;
        const acc = Object.keys(current_list).some(
            key => key.startsWith(`${platform}.real.${acc_type}`) && should_be_enabled(current_list[key])
        )
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.real.${acc_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    realSyntheticAccountsExistingData(existing_accounts_data('synthetic'));
    realFinancialAccountsExistingData(existing_accounts_data('financial'));

    const synthetic_account_items = isSyntheticCardVisible('real') && (
        <CFDAccountCard
            key='real.synthetic'
            has_cfd_account_error={has_cfd_account_error}
            title={platform === 'mt5' ? localize('Derived') : localize('Synthetic')}
            has_real_account={has_real_account}
            is_accounts_switcher_on={is_accounts_switcher_on}
            is_disabled={isMT5AccountCardDisabled('synthetic')}
            is_logged_in={is_logged_in}
            type={{
                category: 'real',
                type: 'synthetic',
                platform,
            }}
            existing_accounts_data={existing_accounts_data('synthetic')}
            commission_message={localize('No commission')}
            onSelectAccount={() => onSelectRealAccount('synthetic')}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            platform={platform}
            descriptor={
                platform === 'mt5'
                    ? localize('Trade CFDs on our synthetics and basket indices.')
                    : localize('Trade CFDs on our synthetic indices that simulate real-world market movements.')
            }
            specs={specifications[platform as keyof TSpecifications].real_synthetic_specs}
            is_virtual={is_virtual}
            toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            toggleAccountsDialog={toggleAccountsDialog}
            toggleMT5TradeModal={toggleMT5TradeModal}
        />
    );

    const financial_account = isFinancialCardVisible() && (
        <CFDAccountCard
            key='real.financial'
            has_real_account={has_real_account}
            is_disabled={isMT5AccountCardDisabled('financial')}
            title={is_eu_user ? localize('CFDs') : localize('Financial')}
            type={{
                category: 'real',
                type: 'financial',
                platform,
            }}
            existing_accounts_data={existing_accounts_data('financial')}
            commission_message={localize('No commission')}
            onSelectAccount={() => onSelectRealAccount('financial')}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            platform={platform}
            descriptor={general_messages.getFinancialAccountDescriptor(platform, is_eu_user)}
            specs={financial_specs}
            is_accounts_switcher_on={is_accounts_switcher_on}
            is_eu={is_eu_user}
            is_logged_in={is_logged_in}
            is_virtual={is_virtual}
            toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            toggleAccountsDialog={toggleAccountsDialog}
            toggleMT5TradeModal={toggleMT5TradeModal}
            setIsAcuityModalOpen={setIsAcuityModalOpen}
            real_account_creation_unlock_date={real_account_creation_unlock_date}
            setShouldShowCooldownModal={setShouldShowCooldownModal}
        />
    );

    const items = [synthetic_account_items, financial_account].filter(Boolean);

    return (
        <div data-testid='dt_cfd_real_accounts_display' className={classNames('cfd-real-accounts-display')}>
            <DesktopWrapper>
                <Carousel
                    list={items}
                    width={328}
                    nav_position='middle'
                    show_bullet={false}
                    item_per_window={2}
                    is_mt5={true}
                />
            </DesktopWrapper>
            <MobileWrapper>{items}</MobileWrapper>
        </div>
    );
};

export { CFDRealAccountDisplay };
