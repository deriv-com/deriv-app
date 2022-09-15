import React from 'react';
import { localize } from '@deriv/translations';
import { CFDAccountCard } from 'Components/cfd-account-card';
import specifications from 'Constants/cfd-specifications';
import Loading from '../templates/_common/components/loading';
import { DetailsOfEachMT5Loginid, LandingCompany } from '@deriv/api-types';
import { TTradingPlatformAccounts, TCFDPlatform } from 'Components/props.types';
import { TObjectCFDAccount } from 'Containers/cfd-dashboard';

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
    current_list: Record<string, DetailsOfEachMT5Loginid>;
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
        const acc = Object.keys(current_list).some(key => key.startsWith(`${platform}.demo.${acc_type}`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.demo.${acc_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

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
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find((key: string) =>
                                    key.startsWith(`${platform}.demo.all`)
                                ) || ''
                            ],
                            {
                                category: 'demo',
                                type: 'all',
                            }
                        )
                    }
                    platform={platform}
                    descriptor={localize(
                        'Trade CFDs on forex, synthetic indices, cryptocurrencies, basket indices, and commodities with high leverage.'
                    )}
                    specs={specifications.dxtrade.demo_all_specs}
                    has_banner
                />
            )}
        </div>
    );
};

export default CFDDxtradeDemoAccountDisplay;
