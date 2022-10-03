import React from 'react';
import { CFDAccountCard } from 'Components/cfd-account-card';
import { DetailsOfEachMT5Loginid, LandingCompany } from '@deriv/api-types';
import { general_messages } from 'Constants/cfd-shared-strings';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TTradingPlatformAccounts, TCFDPlatform } from 'Components/props.types';
import { TObjectCFDAccount } from 'Containers/cfd-dashboard';
import specifications from 'Constants/cfd-specifications';

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

type TCFDDxtradeAccountDisplay = {
    account_status?: object;
    // TODO: update this type (DetailsOfEachMT5Loginid) when BE changed the schema
    current_list: Record<string, TCurrentList>;
    has_cfd_account_error: boolean;
    has_real_account?: boolean;
    is_accounts_switcher_on?: boolean;
    is_demo_tab?: boolean;
    is_eu_country?: boolean;
    is_eu?: boolean;
    is_loading?: boolean;
    is_logged_in: boolean;
    is_virtual?: boolean;
    landing_companies?: LandingCompany;
    onSelectAccount: (objCFDAccount: TObjectCFDAccount) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    openDerivRealAccountNeededModal?: () => void;
    openPasswordManager: (login?: string, title?: string, group?: string, type?: string, server?: string) => void;
    platform: TCFDPlatform;
    should_enable_add_button?: boolean;
    standpoint: TStandPoint;
    toggleAccountsDialog?: (is_accounts_switcher_on?: boolean) => void;
    toggleShouldShowRealAccountsList?: (is_should_show_real_acc_list?: boolean) => void;
};

const CFDDxtradeAccountDisplay = ({
    current_list,
    has_cfd_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_demo_tab = false,
    is_eu_country,
    is_eu,
    is_loading,
    is_logged_in,
    is_virtual,
    onSelectAccount,
    openAccountTransfer,
    openDerivRealAccountNeededModal,
    openPasswordManager,
    platform,
    should_enable_add_button,
    standpoint,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
}: TCFDDxtradeAccountDisplay) => {
    const type = 'all';
    const acc_type = 'dxtrade';
    const category = is_demo_tab ? 'demo' : 'real';
    const is_eu_user = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    const current_list_index =
        Object.keys(current_list).find(key => key.startsWith(`${platform}.${category}.${acc_type}`)) || '';

    const existing_accounts_data = () => {
        const keyword = `${platform}.${category}.${acc_type}`;

        const accounts = Object.keys(current_list).some(
            key => key.startsWith(keyword) && current_list[key].enabled === 1
        );

        const filter_accounts = Object.keys(current_list)
            .filter(key => key.startsWith(`${platform}.${category}.${acc_type}`))
            .reduce((_acc, cur) => {
                _acc.push(current_list[cur]);
                return _acc;
            }, [] as DetailsOfEachMT5Loginid[]);

        const acc = accounts ? filter_accounts : undefined;
        return acc;
    };

    const onSelectCfdAccount = () => {
        if (should_enable_add_button) {
            openDerivRealAccountNeededModal?.();
        } else {
            onSelectAccount({ category, platform: acc_type, type });
        }
    };

    const onClickFund = () => {
        if (is_demo_tab) {
            return openAccountTransfer(current_list[current_list_index], { category: 'demo', type: 'all' });
        }

        return openAccountTransfer(current_list[current_list_index], { category: 'real', type: 'all' });
    };

    return (
        <React.Fragment>
            <div className='cfd-demo-accounts-display' data-testid='dt_cfd_demo_accounts_display'>
                {is_loading ? (
                    <Loading />
                ) : (
                    <CFDAccountCard
                        commission_message={localize('No commission')}
                        descriptor={general_messages.getFinancialAccountDescriptor(platform)}
                        existing_accounts_data={existing_accounts_data()}
                        has_real_account={has_real_account}
                        is_accounts_switcher_on={is_accounts_switcher_on}
                        has_banner={is_demo_tab}
                        is_disabled={has_cfd_account_error || standpoint.malta}
                        is_eu={is_eu_user}
                        is_logged_in={is_logged_in}
                        is_virtual={is_virtual}
                        key='cfd'
                        onClickFund={() => onClickFund()}
                        onPasswordManager={openPasswordManager}
                        onSelectAccount={() => onSelectCfdAccount()}
                        platform={platform}
                        specs={specifications.dxtrade}
                        title={localize('Deriv X')}
                        toggleAccountsDialog={toggleAccountsDialog}
                        toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
                        type={{ category, platform: acc_type, type }}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default CFDDxtradeAccountDisplay;
