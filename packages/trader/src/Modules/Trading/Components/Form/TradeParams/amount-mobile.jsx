import React                          from 'react';
import { Tabs, Numpad }               from '@deriv/components';
import { connect }                    from 'Stores/connect';

const AmountWrapper = ({ consoleOut }) => {
    return (
        <div className='trade-params__amount-keypad'>
            <Numpad
                value={5}
                onSubmit={consoleOut}
                is_currency
                render={({ value: v, className }) => {
                    return (
                        <div className={className}>{v}</div>
                    );
                }}
                pip_size={2}
                min={0}
                max={1000}
                onValueChange={() => {}}
            />
        </div>
    );
};

const Amount = ({ basis_list, basis, amount_tab_idx, setAmountTabIdx }) => {
    console.log('basis: ', basis);
    const has_selected_tab_idx = typeof amount_tab_idx !== 'undefined';
    const active_index = has_selected_tab_idx ?
        amount_tab_idx : basis_list.findIndex(b => b.value === basis);

    const consoleOut = val => {
        // eslint-disable-next-line no-console
        console.log(val);
    };

    return (
        <div>
            <Tabs active_index={active_index} onTabItemClick={setAmountTabIdx} top>
                {
                    basis_list.map((basis_option) => {
                        switch (basis_option.value) {
                            case 'stake':
                                return (
                                    <div label={basis_option.text} key={basis_option.value}>
                                        <AmountWrapper consoleOut={consoleOut} />
                                    </div>
                                );
                            case 'payout':
                                return (
                                    <div  label={basis_option.text} key={basis_option.value}>
                                        <AmountWrapper consoleOut={consoleOut} />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })
                }
            </Tabs>
        </div>
    );
};

export default connect(({ modules }) => ({
    basis              : modules.trade.basis,
    basis_list         : modules.trade.basis_list,
}))(Amount);
