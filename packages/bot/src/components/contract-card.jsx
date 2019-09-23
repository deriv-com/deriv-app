import classNames            from 'classnames';
import {
    Money,
    UnderlyingIcon }         from 'deriv-components';
import React                 from 'react';
import PropTypes             from 'prop-types';
import CurrencyUtils         from 'deriv-shared/utils/currency';
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
import { translate }         from '../utils/lang/i18n';
import                            '../assets/sass/contract-card.scss';

class ContractCard extends React.PureComponent {
    componentDidMount() {
        this.props.registerOnAccountSwitch();
    }

    componentWillUnmount() {
        this.props.disposeOnAccountSwitch();
        this.props.disposeObserverListener();
    }

    render() {
        const {
            contract,
            profit_movement,
            indicative_movement,
            is_loading,
        } = this.props;

        return (
            <div className={classNames(
                'db-contract-card', {
                    'db-contract-card--inactive'  : !contract && !is_loading,
                    'db-contract-card--is-loading': is_loading,
                    'db-contract-card--is-winning': contract && contract.profit > 0,
                    'db-contract-card--is-losing' : contract && contract.profit < 0,
                    'db-contract-card--completed' : !is_loading && contract && isEnded(contract),
                })}
            >
                { is_loading && <ContractCardLoader /> }
                { !is_loading && contract &&
                    <React.Fragment>
                        { !!isEnded(contract) && <ContractResultOverlay profit={contract.profit} /> }
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
                                    { isEnded(contract) ? translate('Profit/Loss:') : translate('Potential profit/loss:') }
                                </div>
                                <div className='db-contract-card__indicative-price db-contract-card__indicative-price-label'>
                                    { isEnded(contract) ? translate('Payout:') : translate('Indicative price:') }
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
                                    { translate('Purchase price:') }
                                </div>
                                <div className='db-contract-card__potential-payout db-contract-card__potential-payout-label'>
                                    { translate('Potential payout:') }
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
                { !is_loading && !contract &&
                    <React.Fragment>
                        { translate('Build a bot from the start menu then hit the run button to run the bot.') }
                    </React.Fragment>}
            </div>
        );
    }
}

ContractCard.propTypes = {
    contract               : PropTypes.object,
    disposeObserverListener: PropTypes.func,
    disposeOnAccountSwitch : PropTypes.func,
    indicative_moment      : PropTypes.string,
    is_loading             : PropTypes.bool,
    profit_movement        : PropTypes.string,
    registerOnAccountSwitch: PropTypes.func,
};

export default connect(({ contract_card }) => ({
    contract               : contract_card.contract,
    disposeObserverListener: contract_card.disposeObserverListener,
    disposeOnAccountSwitch : contract_card.disposeOnAccountSwitch,
    indicative_movement    : contract_card.indicative_movement,
    is_loading             : contract_card.is_loading,
    profit_movement        : contract_card.profit_movement,
    registerOnAccountSwitch: contract_card.registerOnAccountSwitch,
}))(ContractCard);
