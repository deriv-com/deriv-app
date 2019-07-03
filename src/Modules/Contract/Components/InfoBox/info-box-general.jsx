import classNames       from 'classnames';
import { observer }     from 'mobx-react';
import PropTypes        from 'prop-types';
import React            from 'react';
import { localize }     from 'App/i18n';
import Money            from 'App/Components/Elements/money.jsx';
import RemainingTime    from 'App/Containers/remaining-time.jsx';
import {
    getIndicativePrice,
    isEnded,
    isStarted }         from 'Stores/Modules/Contract/Helpers/logic';
import ContractSell     from '../../Containers/contract-sell.jsx';

const InfoBoxGeneral = ({ className, contract_info }) => {
    const {
        buy_price,
        currency,
        date_expiry,
        profit,
    } = contract_info;

    const indicative_price = getIndicativePrice(contract_info);
    const is_started       = isStarted(contract_info);
    const is_ended         = isEnded(contract_info);

    return (
        <div className={classNames('general', className)}>
            <div>
                <div>{localize('Purchase Price')}</div>
                <div>{localize('Indicative Price')}</div>
                <div>{localize('Profit/Loss')}</div>
            </div>
            <div className='values'>
                <div>
                    <Money amount={buy_price} currency={currency} />
                </div>
                <div>
                    <Money amount={indicative_price} currency={currency} />
                </div>
                <div className={profit >= 0 ? 'profit' : 'loss'}>
                    <Money amount={profit} currency={currency} has_sign />
                </div>
            </div>
            { !is_ended &&
                <div>
                    <div>{localize('Remaining Time')}</div>
                    <strong>
                        {is_started && date_expiry ?
                            <RemainingTime end_time={date_expiry} />
                            :
                            '-'
                        }
                    </strong>
                </div>
            }
            <ContractSell />
        </div>
    );
};

InfoBoxGeneral.propTypes = {
    className    : PropTypes.string,
    contract_info: PropTypes.object,
    onClickSell  : PropTypes.func,
};

export default observer(InfoBoxGeneral);
