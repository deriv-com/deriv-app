import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Carousel } from '@deriv/components';
import { getAccountListKey, getCFDAccountKey } from '@deriv/shared';
import specifications, { TSpecifications } from 'Constants/cfd-specifications';
import { CFDAccountCard } from 'Components/cfd-account-card';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { TExistingData, TTradingPlatformAccounts } from 'Components/props.types';
import { TObjectCFDAccount } from 'Containers/cfd-dashboard';

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

type TCFDRealAccountDisplayProps = {
    has_real_account: boolean;
    is_accounts_switcher_on: boolean;
    has_cfd_account_error: boolean;
    is_loading?: boolean;
    is_logged_in: boolean;
    is_virtual: boolean;
    onSelectAccount: (objCFDAccount: TObjectCFDAccount) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    platform: string;
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    openPasswordManager: (login?: string, title?: string, group?: string, type?: string, server?: string) => void;
    toggleAccountsDialog: (is_accounts_switcher_on?: boolean) => void;
    toggleShouldShowRealAccountsList: (is_should_show_real_acc_list?: boolean) => void;
    account_status?: object;
    openDerivRealAccountNeededModal: () => void;
    should_enable_add_button?: boolean;
};

const CFDDxtraderAccountDisplay = ({
    has_real_account,
    is_accounts_switcher_on,
    has_cfd_account_error,
    is_virtual,
    onSelectAccount,
    openAccountTransfer,
    current_list,
    openPasswordManager,
    platform,
    is_logged_in,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
    openDerivRealAccountNeededModal,
    should_enable_add_button,
}: TCFDRealAccountDisplayProps) => {
    const onSelectRealAccount = (type: string) => {
        if (should_enable_add_button) {
            openDerivRealAccountNeededModal();
        } else {
            onSelectAccount({ type, category: 'real', platform });
        }
    };

    const onClickFundReal = (account: TExistingData) => {
        return openAccountTransfer(current_list[getAccountListKey(account, platform)], {
            category: account.account_type as keyof TOpenAccountTransferMeta,
            type: getCFDAccountKey({
                market_type: account.market_type,
                sub_account_type: (account as DetailsOfEachMT5Loginid).sub_account_type,
                platform,
            }),
        });
    };

    const existing_accounts_data = (acc_type: 'synthetic') => {
        const acc = Object.keys(current_list).some(key => key.startsWith(`${platform}.real.${acc_type}`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.real.${acc_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    const synthetic_account_items = (
        <CFDAccountCard
            key='cfd'
            has_cfd_account_error={has_cfd_account_error}
            title={localize('CFDs')}
            has_real_account={has_real_account}
            is_accounts_switcher_on={is_accounts_switcher_on}
            is_logged_in={is_logged_in}
            type={{
                category: 'real',
                type: 'cfd',
                platform: 'dxtrade',
            }}
            existing_accounts_data={existing_accounts_data('synthetic')}
            commission_message={localize('No commission')}
            onSelectAccount={() => onSelectRealAccount('synthetic')}
            onPasswordManager={openPasswordManager}
            onClickFund={onClickFundReal}
            platform={platform}
            descriptor={localize(
                'Trade CFDs on forex, synthetic indices, cryptocurrencies, basket indices, and commodities with high leverage.'
            )}
            specs={specifications[platform as keyof TSpecifications].real_synthetic_specs}
            is_virtual={is_virtual}
            toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
            toggleAccountsDialog={toggleAccountsDialog}
        />
    );

    const items = [synthetic_account_items].filter(Boolean);

    return (
        <div data-testid='dt_cfd_real_accounts_display' className={classNames('cfd-real-accounts-display')}>
            <DesktopWrapper>
                <Carousel
                    list={[synthetic_account_items].filter(Boolean)}
                    width={328}
                    nav_position='middle'
                    show_bullet={false}
                    item_per_window={2}
                />
            </DesktopWrapper>
            <MobileWrapper>{items}</MobileWrapper>
        </div>
    );
};

export default CFDDxtraderAccountDisplay;
