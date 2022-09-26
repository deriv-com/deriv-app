import React from 'react';
import { localize } from '@deriv/translations';
import { CFDAccountCard } from './cfd-account-card';
import { general_messages } from '../Constants/cfd-shared-strings';
import specifications, { TSpecifications } from '../Constants/cfd-specifications';
import Loading from '../templates/_common/components/loading';
import { DetailsOfEachMT5Loginid, LandingCompany } from '@deriv/api-types';
import { TTradingPlatformAccounts, TCFDPlatform } from './props.types';
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
    is_eu: boolean;
    is_eu_country: boolean;
    has_maltainvest_account: boolean;
    has_cfd_account_error: boolean;
    openAccountNeededModal: (target: string, target_label: string, target_dmt5_label: string) => void;
    standpoint: TStandPoint;
    is_loading: boolean;
    is_logged_in: boolean;
    isSyntheticCardVisible: (account_category: string) => boolean;
    isFinancialCardVisible: () => boolean;
    onSelectAccount: (objCFDAccount: TObjectCFDAccount) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    platform: TCFDPlatform;
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    openPasswordManager: (login?: string, title?: string, group?: string, type?: string, server?: string) => void;
    residence: string;
    landing_companies?: LandingCompany;
    toggleMT5TradeModal: () => void;
};

const CFDDemoAccountDisplay = ({
    is_eu,
    is_eu_country,
    has_maltainvest_account,
    has_cfd_account_error,
    openAccountNeededModal,
    standpoint,
    is_loading,
    is_logged_in,
    isSyntheticCardVisible,
    isFinancialCardVisible,
    onSelectAccount,
    openAccountTransfer,
    platform,
    current_list,
    openPasswordManager,
    residence,
    toggleMT5TradeModal,
}: TCFDDemoAccountDisplayProps) => {
    const is_eu_user = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    const openCFDAccount = () => {
        if (is_eu && !has_maltainvest_account && standpoint.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
        } else {
            onSelectAccount({
                category: 'demo',
                type: 'financial',
                platform,
            });
        }
    };

    const financial_accounts_data = () => {
        const acc = Object.keys(current_list).some(key => key.startsWith(`${platform}.demo.financial`))
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.demo.financial`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };

    const financial_specs = React.useMemo(() => {
        const should_show_eu = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
        if (residence === 'au') {
            return specifications[platform as keyof TSpecifications].au_real_financial_specs;
        }
        if (should_show_eu) {
            return specifications[platform as keyof TSpecifications].eu_real_financial_specs;
        }
        return specifications[platform as keyof TSpecifications].real_financial_specs;
    }, [is_logged_in, is_eu, is_eu_country, residence, platform]);

    return is_loading ? (
        <div className='cfd-demo-accounts-display'>
            <Loading />
        </div>
    ) : (
        <div className='cfd-demo-accounts-display' data-testid='dt_cfd_demo_accounts_display'>
            {isSyntheticCardVisible('demo') && (
                <CFDAccountCard
                    title={localize('Derived')}
                    type={{
                        category: 'demo',
                        type: 'synthetic',
                        platform,
                    }}
                    is_disabled={has_cfd_account_error || standpoint.malta}
                    is_logged_in={is_logged_in}
                    existing_accounts_data={
                        current_list[
                            Object.keys(current_list).find((key: string) =>
                                key.startsWith(`${platform}.demo.synthetic`)
                            ) || ''
                        ]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={() =>
                        onSelectAccount({
                            category: 'demo',
                            type: 'synthetic',
                            platform,
                        })
                    }
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find((key: string) =>
                                    key.startsWith(`${platform}.demo.synthetic`)
                                ) || ''
                            ],
                            {
                                category: 'demo',
                                type: 'synthetic',
                            }
                        )
                    }
                    platform={platform}
                    descriptor={localize('Trade CFDs on our synthetics, basket indices, and Derived FX.')}
                    specs={specifications[platform as keyof TSpecifications].real_synthetic_specs}
                    has_banner
                    toggleMT5TradeModal={toggleMT5TradeModal}
                />
            )}

            {isFinancialCardVisible() && (
                <CFDAccountCard
                    title={is_eu_user ? localize('CFDs') : localize('Financial')}
                    is_disabled={has_cfd_account_error}
                    is_logged_in={is_logged_in}
                    is_eu={is_eu_user}
                    type={{
                        category: 'demo',
                        type: 'financial',
                        platform,
                    }}
                    existing_accounts_data={financial_accounts_data()}
                    commission_message={localize('No commission')}
                    onSelectAccount={openCFDAccount}
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find((key: string) =>
                                    key.startsWith(`${platform}.demo.financial`)
                                ) || ''
                            ],
                            {
                                category: 'demo',
                                type: 'financial',
                            }
                        )
                    }
                    platform={platform}
                    descriptor={general_messages.getFinancialAccountDescriptor(platform, is_eu_user)}
                    specs={financial_specs}
                    has_banner
                    toggleMT5TradeModal={toggleMT5TradeModal}
                />
            )}
        </div>
    );
};

export { CFDDemoAccountDisplay };
