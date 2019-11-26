import React                  from 'react';
import { localize, Localize } from 'deriv-translations';
// import IconMT5Advanced                  from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-advanced.svg';
import IconMT5Standard        from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-standard.svg';
import IconMT5Synthetic       from 'Assets/SvgComponents/mt5/accounts-display/icon-mt5-synthetic.svg';
import { MT5AccountCard }     from './mt5-account-card.jsx';
import Loading                from '../../../templates/_common/components/loading.jsx';

const MT5DemoAccountDisplay = ({
    is_loading,
    onSelectAccount,
    openAccountTransfer,
    current_list,
    has_mt5_account,
    openPasswordManager,
}) => (is_loading ? (
    <div className='mt5-demo-accounts-display'>
        <Loading />
    </div>
) : (
    <div className='mt5-demo-accounts-display'>
        <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Standard />)}
            title={localize('Standard')}
            type={{
                category: 'demo',
                type    : 'standard',
            }}
            existing_data={current_list['demo.standard']}
            commission_message={
                <Localize
                    i18n_default_text='No commission <0>(excluding cryptocurrencies)</0>'
                    components={[<span key={0} className='mt5-dashboard--hint' />]}
                />
            }
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['demo.standard'], {
                category: 'demo',
                type    : 'standard',
            })}
            descriptor={localize('Suitable for both new and experienced traders.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        />
        {/* TODO Bring this back when Real Advanced is implemented */}
        {/* <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Advanced />)}
            title={localize('Advanced')}
            type={{
                category: 'demo',
                type    : 'advanced',
            }}
            existing_data={current_list['demo.advanced']}
            commission_message={<Localize i18n_default_text='No commission' />}
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['demo.advanced'], {
                category: 'demo',
                type    : 'advanced',
            })}
            descriptor={localize('Give you more products, tight spreads, and higher ticket size.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:100'),
                [localize('Margin call')]     : localize('150%'),
                [localize('Stop out level')]  : localize('75%'),
                [localize('Number of assets')]: localize('50+'),
            }}
        /> */}
        <MT5AccountCard
            has_mt5_account={has_mt5_account}
            icon={() => (<IconMT5Synthetic />)}
            title={localize('Synthetic Indices')}
            type={{
                category: 'demo',
                type    : 'synthetic_indices',
            }}
            existing_data={current_list['demo.synthetic_indices']}
            commission_message={<Localize i18n_default_text='No commission' />}
            onSelectAccount={onSelectAccount}
            onPasswordManager={openPasswordManager}
            onClickFund={() => openAccountTransfer(current_list['demo.synthetic_indices'], {
                category: 'demo',
                type    : 'synthetic_indices',
            })}
            descriptor={localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.')}
            specs={{
                [localize('Leverage')]        : localize('Up to 1:1000'),
                [localize('Margin call')]     : localize('100%'),
                [localize('Stop out level')]  : localize('50%'),
                [localize('Number of assets')]: localize('10+'),
            }}
        />
    </div>
));

export { MT5DemoAccountDisplay };
