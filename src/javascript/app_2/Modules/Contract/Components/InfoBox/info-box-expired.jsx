import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';
import Money        from 'App/Components/Elements/money.jsx';
import Icon         from 'Assets/Common/icon.jsx';
import IconFlag     from 'Assets/Contract/icon-flag.jsx';
import SellInfo     from '../Sell/sell-info.jsx';

const InfoBoxExpired = ({
    contract_info,
    has_flag = true,
    has_percentage = true,
    sell_info = {},
}) => {
    const {
        currency,
        profit,
        profit_percentage,
    } = contract_info;

    const percentage_text = `${profit_percentage > 0 ? '+' : ''}${profit_percentage}%`;

    return (
        <div className={`expired ${profit > 0 ? 'won' : 'lost'}`}>
            { sell_info.transaction_id &&
                <SellInfo contract_info={contract_info} sell_info={sell_info} />
            }
            { has_flag &&
                <Icon icon={IconFlag} />
            }
            <div>
                <div>{localize('Profit/Loss')}:</div>
                <div className='pl-value'>
                    <Money amount={profit} currency={currency} has_sign />
                    { has_percentage &&
                        <span className='percentage'>({percentage_text})</span>
                    }
                </div>
            </div>
        </div>
    );
};

InfoBoxExpired.propTypes = {
    contract_info : PropTypes.object,
    has_flag      : PropTypes.bool,
    has_percentage: PropTypes.bool,
    sell_info     : PropTypes.object,
};

export default observer(InfoBoxExpired);
