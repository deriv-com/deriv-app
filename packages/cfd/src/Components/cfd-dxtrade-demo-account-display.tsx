import React from 'react';
import { localize } from '@deriv/translations';
import { CFDAccountCard } from './cfd-account-card';
import specifications from '../Constants/cfd-specifications';
import Loading from '../templates/_common/components/loading';
import { LandingCompany, DetailsOfEachMT5Loginid } from '@deriv/api-types';
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

type TCFDDemoAccountDisplayProps = {
    has_cfd_account_error: boolean;
    standpoint: TStandPoint;
    is_loading: boolean;
    is_logged_in: boolean;
    onSelectAccount: (objCFDAccount: TObjectCFDAccount) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    platform: TCFDPlatform;
    // TODO: update this type (DetailsOfEachMT5Loginid) when BE changed the schema
    current_list: Record<
        string,
        DetailsOfEachMT5Loginid & {
            enabled: number;
        }
    >;
    openPasswordManager: (login?: string, title?: string, group?: string, type?: string, server?: string) => void;
    landing_companies?: LandingCompany;
};

const CFDDxtradeDemoAccountDisplay = ({
    has_cfd_account_error,
    standpoint,
    is_loading,
    is_logged_in,
    onSelectAccount,
    openAccountTransfer,
    platform,
    current_list,
    openPasswordManager,
}: TCFDDemoAccountDisplayProps) => {
    const existing_accounts_data = (acc_type: 'dxtrade') => {
        const acc = Object.keys(current_list).some(
            key => key.startsWith(`${platform}.demo.${acc_type}`) && current_list[key].enabled === 1
        )
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.demo.${acc_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    const current_list_index = Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.dxtrade`)) || '';

    return (
        <div className='cfd-demo-accounts-display' data-testid='dt_cfd_demo_accounts_display'>
            {is_loading ? (
                <Loading />
            ) : (
                <CFDAccountCard
                    key='cfd'
                    title={localize('Deriv X')}
                    type={{
                        category: 'demo',
                        platform: 'dxtrade',
                        type: 'all',
                    }}
                    is_disabled={has_cfd_account_error || standpoint.malta}
                    is_logged_in={is_logged_in}
                    existing_accounts_data={existing_accounts_data('dxtrade')}
                    commission_message={localize('No commission')}
                    onSelectAccount={() =>
                        onSelectAccount({
                            category: 'demo',
                            platform: 'dxtrade',
                            type: 'all',
                        })
                    }
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(current_list[current_list_index], {
                            category: 'demo',
                            type: 'all',
                        })
                    }
                    platform={platform}
                    descriptor={localize(
                        'Trade CFDs on forex, derived indices, cryptocurrencies, and commodities with high leverage.'
                    )}
                    specs={specifications.dxtrade.demo_all_specs}
                    has_banner
                />
            )}
        </div>
    );
};

export default CFDDxtradeDemoAccountDisplay;
