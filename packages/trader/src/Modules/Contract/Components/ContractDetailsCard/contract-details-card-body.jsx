import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { Icon, Money }          from 'deriv-components';
import CurrencyUtils            from 'deriv-shared/utils/currency';
import ContractCardItem         from 'App/Components/Elements/ContractDrawer/contract-card-item.jsx';
import { localize }             from 'deriv-translations';
import { getLimitOrderAmount }  from 'Stores/Modules/Contract/Helpers/limit-orders';
import { getIndicativePrice }   from 'Stores/Modules/Contract/Helpers/logic';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';

export const MultiplierContractCard = ({
    contract_info: {
        buy_price,
        deal_cancellation: {
            ask_price: deal_cancellation_price,
        } = {},
        is_sold,
        profit,
        multiplier,
        limit_order,
    },
    currency,
    status,
}) => {
    const { take_profit, stop_loss } = getLimitOrderAmount(limit_order);

    return (
        <>
            <ContractCardItem header={localize('Stake:')}>
                <Money amount={buy_price - deal_cancellation_price} currency={currency} />
            </ContractCardItem>
            <ContractCardItem
                header={is_sold ? localize('Profit/Loss') : localize('Potential profit/loss:')}
                is_crypto={CurrencyUtils.isCryptocurrency(currency)}
                is_loss={+profit < 0}
                is_won={+profit > 0}
            >
                <Money amount={profit} currency={currency} />
                <div className={classNames(
                    'contract-card__indicative--movement', {
                        'contract-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    {status === 'profit' && <Icon icon='IcProfit' />}
                    {status === 'loss'   && <Icon icon='IcLoss' />}
                </div>
            </ContractCardItem>

            <ContractCardItem header={localize('Multiplier:')}>
                x{multiplier}
            </ContractCardItem>
            <ContractCardItem header={localize('Take profit:')}>
                {take_profit ?
                    <Money amount={take_profit} currency={currency} />
                    :
                    <strong>-</strong>
                }
            </ContractCardItem>
            <ContractCardItem header={localize('Deal cancel fee:')}>
                {deal_cancellation_price ?
                    <Money amount={deal_cancellation_price} currency={currency} />
                    :
                    <strong>-</strong>
                }
            </ContractCardItem>
            <ContractCardItem header={localize('Stop loss:')}>
                {stop_loss ?
                    <React.Fragment>
                        <strong>-</strong>
                        <Money amount={stop_loss} currency={currency} />
                    </React.Fragment>
                    :
                    <strong>-</strong>
                }
            </ContractCardItem>
        </>
    );
};

const ContractDetailsCardBody = ({
    contract_info,
    currency,
    status,
}) => {
    const indicative = getIndicativePrice(contract_info);
    const { buy_price, is_sold, sell_price, payout, profit } = contract_info;

    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    if (is_multiplier) {
        return (
            <MultiplierContractCard
                contract_info={contract_info}
                currency={currency}
                status={status}
            />
        );
    }

    return (
        <>
            <ContractCardItem
                header={is_sold ? localize('Profit/Loss') : localize('Potential profit/loss:')}
                is_crypto={CurrencyUtils.isCryptocurrency(currency)}
                is_loss={+profit < 0}
                is_won={+profit > 0}
            >
                <Money amount={profit} currency={currency} />
                <div className={classNames(
                    'contract-card__indicative--movement', {
                        'contract-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    {status === 'profit' && <Icon icon='IcProfit' />}
                    {status === 'loss'   && <Icon icon='IcLoss' />}
                </div>
            </ContractCardItem>
            <ContractCardItem header={is_sold ? localize('Payout:') : localize('Indicative price:')}>
                <Money currency={currency}  amount={sell_price || indicative} />
                <div className={classNames(
                    'contract-card__indicative--movement', {
                        'contract-card__indicative--movement-complete': is_sold,
                    },
                )}
                >
                    {status === 'profit' && <Icon icon='IcProfit' />}
                    {status === 'loss'   && <Icon icon='IcLoss' />}
                </div>
            </ContractCardItem>
            <ContractCardItem header={localize('Purchase price:')}>
                <Money amount={buy_price} currency={currency} />
            </ContractCardItem>
            <ContractCardItem header={localize('Potential payout:')}>
                <Money currency={currency} amount={payout} />
            </ContractCardItem>
        </>
    );
};

ContractDetailsCardBody.propTypes = {
    contract_info: PropTypes.object,
    currency     : PropTypes.string,
    status       : PropTypes.string,
};

export default ContractDetailsCardBody;
