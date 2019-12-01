import classNames            from 'classnames';
import {
    Money,
    UnderlyingIcon }         from 'deriv-components';
import React                 from 'react';
import PropTypes             from 'prop-types';
import CurrencyUtils         from 'deriv-shared/utils/currency';
import { localize }          from 'deriv-translations';
import ContractCardLoader    from './contract-card-loading.jsx';
import ContractResultOverlay from './contract-result-overlay.jsx';
import {
    ProfitMovementIcon,
    LossMovementIcon }       from './Icons.jsx';
import IconTradeType         from './icon-trade-types.jsx';
import { connect }           from '../stores/connect';
import {
    getIndicativePrice,
    isEnded,
    getContractTypeName }    from '../utils/contract';
import                            '../assets/sass/contract-card.scss';

const ContractCard = ({
    contract,
    profit_movement,
    is_contract_completed,
    is_contract_loading,
    is_contract_losing,
    is_contract_inactive,
    is_contract_winning,
    indicative_movement,
}) => {
    return (
        <div className={classNames(
            'db-contract-card', {
                'db-contract-card--inactive'  : is_contract_inactive,
                'db-contract-card--is-loading': is_contract_loading,
                'db-contract-card--is-winning': is_contract_winning,
                'db-contract-card--is-losing' : is_contract_losing,
                'db-contract-card--completed' : is_contract_completed,
            })}
        >
            { is_contract_loading && <ContractCardLoader /> }
            { !is_contract_loading && contract &&
            <React.Fragment>
                { is_contract_completed && <ContractResultOverlay profit={contract.profit} /> }
                <div className='db-contract-card__underlying'>
                    <div className='db-contract-card__underlying-name'>
                        <UnderlyingIcon market={contract.underlying} />
                        <span className='db-contract-card__underlying-symbol'>
                            { contract.display_name }
                        </span>
                    </div>
                    <div className='db-contract-card__underlying-type'>
                        <div className='db-contract-card__underlying-type-wrapper'>
                            <div className='db-contract-card__underlying-type-icon'>
                                <IconTradeType trade_type={contract.contract_type} />
                            </div>
                        </div>
                        <span className='db-contract-card__underlying-type-label'>
                            { getContractTypeName(contract) }
                        </span>
                    </div>
                </div>
                <div className='db-contract-card__separator' />
                <div className='db-contract-card__stats'>
                    <div className='db-contract-card__grid'>
                        <div className='db-contract-card__profit-loss db-contract-card__profit-loss-label'>
                            { isEnded(contract) ? localize('Profit/Loss:') : localize('Potential profit/loss:') }
                        </div>
                        <div className='db-contract-card__indicative-price db-contract-card__indicative-price-label'>
                            { isEnded(contract) ? localize('Payout:') : localize('Indicative price:') }
                        </div>
                        <div className={classNames(
                            'db-contract-card__profit-loss',
                            'db-contract-card__profit-loss-amount', {
                                'db-contract-card__profit-loss--is-crypto': CurrencyUtils.isCryptocurrency(contract.currency),
                                'db-contract-card__profit-loss--negative' : (contract.profit < 0),
                                'db-contract-card__profit-loss--positive' : (contract.profit > 0),
                            })}
                        >
                            <Money amount={Math.abs(contract.profit)} currency={contract.currency} />
                            <div className='db-contract-card__indicative-movement'>
                                { profit_movement === 'profit' && <ProfitMovementIcon /> ||
                                      profit_movement === 'loss' && <LossMovementIcon /> ||
                                      <React.Fragment /> }
                            </div>
                        </div>

                        <div className='db-contract-card__indicative-price db-contract-card__indicative-price-amount'>
                            <Money
                                amount={contract.sell_price || getIndicativePrice(contract)}
                                currency={contract.currency}
                            />
                            <div className='db-contract-card__indicative-movement'>
                                { indicative_movement === 'profit' && <ProfitMovementIcon /> ||
                                      indicative_movement === 'loss' && <LossMovementIcon /> ||
                                      <React.Fragment /> }
                            </div>
                        </div>

                    </div>
                    <div className='db-contract-card__grid'>
                        <div className='db-contract-card__purchase-price db-contract-card__purchase-price-label'>
                            { localize('Purchase price:') }
                        </div>
                        <div className='db-contract-card__potential-payout db-contract-card__potential-payout-label'>
                            { localize('Potential payout:') }
                        </div>
                        <div className='db-contract-card__purchase-price db-contract-card__purchase-price-amount'>
                            <Money amount={contract.buy_price} currency={contract.currency} />
                        </div>
                        <div className='db-contract-card__potential-payout db-contract-card__potential-payout-amount'>
                            { contract.payout ?
                                <Money amount={contract.payout} currency={contract.currency} />
                                :
                                <strong>-</strong> }
                        </div>
                    </div>
                </div>
            </React.Fragment>
            }
            { !is_contract_loading && !contract &&
            <React.Fragment>
                { localize('Build a bot from the start menu then hit the run button to run the bot.') }
            </React.Fragment>}
        </div>
    );
};

ContractCard.propTypes = {
    contract             : PropTypes.object,
    indicative_moment    : PropTypes.string,
    is_contract_completed: PropTypes.bool,
    is_contract_inactive : PropTypes.bool,
    is_contract_loading  : PropTypes.bool,
    is_contract_losing   : PropTypes.bool,
    is_contract_winning  : PropTypes.bool,
    profit_movement      : PropTypes.string,
};

export default connect(({ contract_card }) => ({
    contract             : contract_card.contract,
    is_contract_completed: contract_card.is_contract_completed,
    is_contract_loading  : contract_card.is_contract_loading,
    is_contract_losing   : contract_card.is_contract_losing,
    is_contract_inactive : contract_card.is_contract_inactive,
    is_contract_winning  : contract_card.is_contract_winning,
    indicative_movement  : contract_card.indicative_movement,
    profit_movement      : contract_card.profit_movement,
}))(ContractCard);
