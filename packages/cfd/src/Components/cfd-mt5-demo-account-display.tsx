import React from 'react';
import { localize } from '@deriv/translations';
import { CFDAccountCard } from './cfd-account-card';
import { general_messages } from '../Constants/cfd-shared-strings';
import specifications, { TSpecifications } from '../Constants/cfd-specifications';
import Loading from '../templates/_common/components/loading';
import { LandingCompany, DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { TTradingPlatformAccounts, TCFDPlatform } from './props.types';
import { TObjectCFDAccount } from '../Containers/cfd-dashboard';
import { TCFDPasswordReset } from '../Containers/props.types';

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
    isSwapFreeCardVisible: () => boolean;
    onSelectAccount: (objCFDAccount: TObjectCFDAccount) => void;
    openAccountTransfer: (
        data: DetailsOfEachMT5Loginid | TTradingPlatformAccounts,
        meta: TOpenAccountTransferMeta
    ) => void;
    platform: TCFDPlatform;
    current_list: Record<string, DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[]>;
    openPasswordManager: (
        login?: string,
        title?: string,
        group?: TCFDPasswordReset['account_group'],
        type?: string,
        server?: string
    ) => void;
    residence: string;
    landing_companies?: LandingCompany;
    toggleMT5TradeModal: () => void;
    show_eu_related_content: boolean;
};

const CFDMT5DemoAccountDisplay = ({
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
    isSwapFreeCardVisible,
    onSelectAccount,
    openAccountTransfer,
    platform,
    current_list,
    openPasswordManager,
    residence,
    show_eu_related_content,
}: TCFDDemoAccountDisplayProps) => {
    const openAccountTransferList = (type: DetailsOfEachMT5Loginid['market_type']) => {
        return Object.keys(current_list).find((key: string) => key.startsWith(`${platform}.demo.${type}`)) || '';
    };

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

    return (
        <React.Fragment>
            {is_loading ? (
                <Loading />
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
                            existing_accounts_data={current_list[openAccountTransferList('synthetic')]}
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
                                openAccountTransfer(current_list[openAccountTransferList('synthetic')], {
                                    category: 'demo',
                                    type: 'synthetic',
                                })
                            }
                            platform={platform}
                            descriptor={localize('Trade CFDs on our synthetics, baskets, and derived FX.')}
                            specs={specifications[platform as keyof TSpecifications].real_synthetic_specs}
                            has_banner
                        />
                    )}

                    {isFinancialCardVisible() && (
                        <CFDAccountCard
                            title={show_eu_related_content ? localize('CFDs') : localize('Financial')}
                            is_disabled={has_cfd_account_error}
                            is_logged_in={is_logged_in}
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
                                openAccountTransfer(current_list[openAccountTransferList('financial')], {
                                    category: 'demo',
                                    type: 'financial',
                                })
                            }
                            platform={platform}
                            descriptor={general_messages.getFinancialAccountDescriptor(
                                platform,
                                show_eu_related_content
                            )}
                            specs={financial_specs}
                            has_banner
                        />
                    )}

                    {isSwapFreeCardVisible() && (
                        <CFDAccountCard
                            title={localize('Swap-Free')}
                            type={{
                                category: 'demo',
                                type: 'all',
                                platform,
                            }}
                            is_disabled={has_cfd_account_error || standpoint.malta}
                            is_logged_in={is_logged_in}
                            existing_accounts_data={current_list[openAccountTransferList('all')]}
                            commission_message={localize('No commission')}
                            onSelectAccount={() =>
                                onSelectAccount({
                                    category: 'demo',
                                    type: 'all',
                                    platform,
                                })
                            }
                            onPasswordManager={openPasswordManager}
                            onClickFund={() =>
                                openAccountTransfer(current_list[openAccountTransferList('all')], {
                                    category: 'demo',
                                    type: 'all',
                                })
                            }
                            platform={platform}
                            descriptor={localize(
                                'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies, and ETFs.'
                            )}
                            specs={specifications[platform as keyof TSpecifications].real_all_specs}
                            has_banner
                        />
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default CFDMT5DemoAccountDisplay;
