import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { Money }                from 'deriv-components';
import CurrencyUtils            from 'deriv-shared/utils/currency';
import ContractCardItem         from 'App/Components/Elements/ContractDrawer/contract-card-item.jsx';
import { localize }             from 'App/i18n';
import Icon                     from 'Assets/icon.jsx';
import { getLimitOrderAmount }  from 'Stores/Modules/Contract/Helpers/limit-orders';
import { getIndicativePrice }   from 'Stores/Modules/Contract/Helpers/logic';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';

const ContractDetailsCardBody = ({
    contract_info,
    currency,
    status,
}) => {
    const indicative = getIndicativePrice(contract_info);
    const { take_profit, stop_loss } = getLimitOrderAmount(contract_info);
    const { buy_price, is_sold, sell_price, payout, profit } = contract_info;

    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    return (
        <React.Fragment>
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
                    <Icon
                        icon='IconPriceMove'
                        type={(!is_sold) ? status : null}
                    />
                </div>
            </ContractCardItem>
            {is_multiplier ?
                <ContractCardItem
                    header={localize('Take profit:')}
                >
                    {take_profit ?
                        <Money amount={take_profit} currency={currency} />
                        :
                        <strong>-</strong>
                    }
                </ContractCardItem>
                :
                <ContractCardItem
                    header={is_sold ? localize('Payout:') : localize('Indicative price:')}
                >
                    <Money currency={currency}  amount={sell_price || indicative} />
                    <div className={classNames(
                        'contract-card__indicative--movement', {
                            'contract-card__indicative--movement-complete': is_sold,
                        },
                    )}
                    >
                        <Icon
                            icon='IconPriceMove'
                            type={(!is_sold) ? status : null}
                        />
                    </div>
                </ContractCardItem>
            }
            <ContractCardItem
                header={is_multiplier ? localize('Stake amount:') : localize('Purchase price:')}
            >
                <Money amount={buy_price} currency={currency} />
            </ContractCardItem>
            {is_multiplier ?
                <ContractCardItem
                    header={localize('Stop loss:')}
                >
                    {stop_loss ?
                        <React.Fragment>
                            <strong>-</strong>
                            <Money amount={stop_loss} currency={currency} />
                        </React.Fragment>
                        :
                        <strong>-</strong>
                    }
                </ContractCardItem>
                :
                <ContractCardItem
                    header={localize('Potential payout:')}
                >
                    <Money currency={currency} amount={payout} />
                </ContractCardItem>
            }

        </React.Fragment>
    );
};

ContractDetailsCardBody.propTypes = {
    contract_info: PropTypes.object,
    currency     : PropTypes.string,
    status       : PropTypes.string,
};

export default ContractDetailsCardBody;
