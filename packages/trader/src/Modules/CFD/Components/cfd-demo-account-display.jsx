import React from 'react';
import { localize } from '@deriv/translations';
import specifications from 'Modules/CFD/Constants/cfd-specifications';
import { CFDAccountCard } from './cfd-account-card.jsx';
import { general_messages } from '../Constants/cfd-shared-strings';
import Loading from '../../../templates/_common/components/loading.jsx';

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
    isFinancialStpCardVisible,
    onSelectAccount,
    openAccountTransfer,
    platform,
    current_list,
    has_cfd_account,
    openPasswordManager,
    residence,
}) => {
    const is_eu_user = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    const openCFDAccount = () => {
        if (is_eu && !has_maltainvest_account && standpoint.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
        } else {
            onSelectAccount({
                category: 'demo',
                type: 'financial',
            });
        }
    };

    const financial_specs = React.useMemo(() => {
        const should_show_eu = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
        if (residence === 'au') {
            return specifications[platform].au_real_financial_specs;
        }
        if (should_show_eu) {
            return specifications[platform].eu_real_financial_specs;
        }
        return specifications[platform].real_financial_specs;
    }, [is_logged_in, is_eu, is_eu_country, residence, platform]);

    return is_loading ? (
        <div className='cfd-demo-accounts-display'>
            <Loading />
        </div>
    ) : (
        <div className='cfd-demo-accounts-display'>
            {isSyntheticCardVisible('demo') && (
                <CFDAccountCard
                    has_cfd_account={has_cfd_account}
                    title={localize('Synthetic')}
                    type={{
                        category: 'demo',
                        type: 'synthetic',
                        platform,
                    }}
                    is_disabled={has_cfd_account_error || standpoint.malta}
                    is_logged_in={is_logged_in}
                    existing_data={
                        current_list[
                            Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.synthetic`))
                        ]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={() =>
                        onSelectAccount({
                            category: 'demo',
                            type: 'synthetic',
                        })
                    }
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.synthetic`))
                            ],
                            {
                                category: 'demo',
                                type: 'synthetic',
                            }
                        )
                    }
                    platform={platform}
                    descriptor={localize(
                        'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                    )}
                    specs={specifications[platform].real_synthetic_specs}
                    has_banner
                />
            )}

            {isFinancialCardVisible() && (
                <CFDAccountCard
                    has_cfd_account={has_cfd_account}
                    title={is_eu_user ? localize('CFDs') : localize('Financial')}
                    is_disabled={has_cfd_account_error}
                    is_logged_in={is_logged_in}
                    is_eu={is_eu_user}
                    type={{
                        category: 'demo',
                        type: 'financial',
                        platform,
                    }}
                    existing_data={
                        current_list[
                            Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial@`))
                        ]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={openCFDAccount}
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial@`))
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
                />
            )}
            {isFinancialStpCardVisible() && (
                <CFDAccountCard
                    has_cfd_account={has_cfd_account}
                    title={localize('Financial STP')}
                    type={{
                        category: 'demo',
                        type: 'financial_stp',
                        platform,
                    }}
                    is_disabled={has_cfd_account_error}
                    is_logged_in={is_logged_in}
                    existing_data={
                        current_list[
                            Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial_stp@`))
                        ]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={() =>
                        onSelectAccount({
                            category: 'demo',
                            type: 'financial_stp',
                        })
                    }
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[
                                Object.keys(current_list).find(key => key.startsWith(`${platform}.demo.financial_stp@`))
                            ],
                            {
                                category: 'demo',
                                type: 'financial_stp',
                            }
                        )
                    }
                    descriptor={localize(
                        'Trade popular currency pairs and cryptocurrencies with straight-through processing order (STP).'
                    )}
                    specs={specifications[platform].demo_financial_stp_specs}
                    platform={platform}
                    has_banner
                />
            )}
        </div>
    );
};

export { CFDDemoAccountDisplay };
