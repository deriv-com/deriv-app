import React from 'react';
import { Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { MT5AccountCard } from './mt5-account-card.jsx';
import Loading from '../../../templates/_common/components/loading.jsx';

const MT5DemoAccountDisplay = ({
    is_loading,
    onSelectAccount,
    openAccountTransfer,
    current_list,
    has_mt5_account,
    openPasswordManager,
    is_logged_in,
    is_eu,
    is_eu_country,
}) =>
    is_loading ? (
        <div className='mt5-demo-accounts-display'>
            <Loading />
        </div>
    ) : (
        <div className='mt5-demo-accounts-display'>
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                icon={() => <Icon icon='IcMt5SyntheticPlatform' size={64} />}
                title={localize('Synthetic')}
                type={{
                    category: 'demo',
                    type: 'synthetic',
                }}
                existing_data={current_list['demo.synthetic']}
                commission_message={<Localize i18n_default_text='No commission' />}
                onSelectAccount={() =>
                    onSelectAccount({
                        category: 'demo',
                        type: 'synthetic',
                    })
                }
                onPasswordManager={openPasswordManager}
                onClickFund={() =>
                    openAccountTransfer(current_list['demo.synthetic'], {
                        category: 'demo',
                        type: 'synthetic',
                    })
                }
                descriptor={localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.')}
                specs={{
                    [localize('Leverage')]: localize('Up to 1:1000'),
                    [localize('Margin call')]: localize('100%'),
                    [localize('Stop out level')]: localize('50%'),
                    [localize('Number of assets')]: localize('10+'),
                }}
                is_logged_in={is_logged_in}
            />
            <MT5AccountCard
                has_mt5_account={has_mt5_account}
                icon={() => <Icon icon='IcMt5FinancialPlatform' size={64} />}
                title={localize('Financial')}
                type={{
                    category: 'demo',
                    type: 'financial',
                }}
                existing_data={current_list['demo.financial']}
                commission_message={
                    <Localize
                        i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                        components={[<span key={0} className='mt5-dashboard--hint' />]}
                    />
                }
                onSelectAccount={() =>
                    onSelectAccount({
                        category: 'demo',
                        type: 'financial',
                    })
                }
                onPasswordManager={openPasswordManager}
                onClickFund={() =>
                    openAccountTransfer(current_list['demo.financial'], {
                        category: 'demo',
                        type: 'financial',
                    })
                }
                descriptor={localize(
                    'Trade commodities, cryptocurrencies, major (standard and micro-lots) and minor currency pairs with high leverage.'
                )}
                specs={{
                    [localize('Leverage')]: localize('Up to 1:1000'),
                    [localize('Margin call')]: localize('150%'),
                    [localize('Stop out level')]: localize('75%'),
                    [localize('Number of assets')]: localize('50+'),
                }}
                is_logged_in={is_logged_in}
            />
            {((!is_logged_in && !is_eu_country) || (is_logged_in && !is_eu)) && (
                <MT5AccountCard
                    has_mt5_account={has_mt5_account}
                    icon={() => <Icon icon='IcMt5FinancialStpPlatform' size={64} />}
                    title={localize('Financial STP')}
                    type={{
                        category: 'demo',
                        type: 'financial_stp',
                    }}
                    existing_data={current_list['demo.financial_stp']}
                    commission_message={<Localize i18n_default_text='No commission' />}
                    onSelectAccount={() =>
                        onSelectAccount({
                            category: 'demo',
                            type: 'financial_stp',
                        })
                    }
                    onPasswordManager={openPasswordManager}
                    onClickFund={() =>
                        openAccountTransfer(current_list['demo.financial_stp'], {
                            category: 'demo',
                            type: 'financial_stp',
                        })
                    }
                    descriptor={localize(
                        'Trade major, minor, and exotic currency pairs with Straight-Through Processing (STP) of your orders direct to the market.'
                    )}
                    specs={{
                        [localize('Leverage')]: localize('Up to 1:100'),
                        [localize('Margin call')]: localize('150%'),
                        [localize('Stop out level')]: localize('75%'),
                        [localize('Number of assets')]: localize('50+'),
                    }}
                    is_logged_in={is_logged_in}
                />
            )}
        </div>
    );

export { MT5DemoAccountDisplay };
