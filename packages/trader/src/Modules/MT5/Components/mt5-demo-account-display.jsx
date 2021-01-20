import React from 'react';
import { localize } from '@deriv/translations';
import { eu_real_financial_specs } from 'Modules/MT5/Constants/mt5-specifications';
import { MT5AccountCard } from './mt5-account-card.jsx';
import Loading from '../../../templates/_common/components/loading.jsx';

const MT5DemoAccountDisplay = ({
    is_eu,
    is_eu_country,
    has_maltainvest_account,
    has_mt5_account_error,
    openAccountNeededModal,
    standpoint,
    is_loading,
    is_logged_in,
    landing_companies,
    onSelectAccount,
    openAccountTransfer,
    current_list,
    has_mt5_account,
    openPasswordManager,
}) => {
    const openMt5Account = () => {
        if (is_eu && !has_maltainvest_account && standpoint.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Financial'), localize('DMT5 Demo Financial'));
        } else {
            onSelectAccount({
                category: 'demo',
                type: 'financial',
            });
        }
    };

    return is_loading ? (
        <div className='mt5-demo-accounts-display'>
            <Loading />
        </div>
    ) : (
        <div className='mt5-demo-accounts-display'>
            {(landing_companies?.mt_gaming_company?.financial || !is_logged_in) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    title={localize('Synthetic')}
                    type={{
                        category: 'demo',
                        type: 'synthetic',
                    }}
                    is_disabled={has_mt5_account_error}
                    is_logged_in={is_logged_in}
                    existing_data={
                        current_list[Object.keys(current_list).find(key => key.startsWith('demo.synthetic'))]
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
                            current_list[Object.keys(current_list).find(key => key.startsWith('demo.synthetic'))],
                            {
                                category: 'demo',
                                type: 'synthetic',
                            }
                        )
                    }
                    descriptor={localize(
                        'Trade CFDs on our Synthetic Indices that simulate real-world market movement.'
                    )}
                    specs={{
                        [localize('Leverage')]: localize('Up to 1:1000'),
                        [localize('Margin call')]: localize('100%'),
                        [localize('Stop out level')]: localize('50%'),
                        [localize('Number of assets')]: localize('10+'),
                    }}
                />
            )}

            {(landing_companies?.mt_financial_company?.financial || !is_logged_in) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    title={localize('Financial')}
                    is_disabled={has_mt5_account_error}
                    is_logged_in={is_logged_in}
                    type={{
                        category: 'demo',
                        type: 'financial',
                    }}
                    existing_data={
                        current_list[Object.keys(current_list).find(key => key.startsWith('demo.financial@'))]
                    }
                    commission_message={localize('No commission')}
                    onSelectAccount={openMt5Account}
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(
                            current_list[Object.keys(current_list).find(key => key.startsWith('demo.financial@'))],
                            {
                                category: 'demo',
                                type: 'financial',
                            }
                        )
                    }
                    descriptor={
                        is_eu || is_eu_country
                            ? localize(
                                  'Trade commodities, cryptocurrencies, major (standard) and minor currency pairs with high leverage.'
                              )
                            : localize(
                                  'Trade commodities, cryptocurrencies, major (standard and micro-lots) and minor currency pairs with high leverage.'
                              )
                    }
                    specs={
                        is_eu || is_eu_country
                            ? eu_real_financial_specs
                            : {
                                  [localize('Leverage')]: localize('Up to 1:1000'),
                                  [localize('Margin call')]: localize('150%'),
                                  [localize('Stop out level')]: localize('75%'),
                                  [localize('Number of assets')]: localize('50+'),
                              }
                    }
                />
            )}
            {(landing_companies?.mt_financial_company?.financial_stp || !is_logged_in) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    title={localize('Financial STP')}
                    type={{
                        category: 'demo',
                        type: 'financial_stp',
                    }}
                    is_disabled={has_mt5_account_error}
                    is_logged_in={is_logged_in}
                    existing_data={
                        current_list[Object.keys(current_list).find(key => key.startsWith('demo.financial_stp@'))]
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
                            current_list[Object.keys(current_list).find(key => key.startsWith('demo.financial_stp@'))],
                            {
                                category: 'demo',
                                type: 'financial_stp',
                            }
                        )
                    }
                    descriptor={localize(
                        'Trade major, minor, exotic currency pairs, and cryptocurrencies with Straight-Through Processing (STP) of your orders direct to the market.'
                    )}
                    specs={{
                        [localize('Leverage')]: localize('Up to 1:100'),
                        [localize('Margin call')]: localize('150%'),
                        [localize('Stop out level')]: localize('75%'),
                        [localize('Number of assets')]: localize('50+'),
                    }}
                />
            )}
        </div>
    );
};

export { MT5DemoAccountDisplay };
