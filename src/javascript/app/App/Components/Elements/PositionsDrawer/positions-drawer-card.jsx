import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { CSSTransition }     from 'react-transition-group';
import ContractLink          from 'Modules/Contract/Containers/contract-link.jsx';
import { localize }          from '_common/localize';
import { IconPriceMove }     from 'Assets/Trading/icon-price-move.jsx';
import ContractTypeCell      from './contract-type-cell.jsx';
import ProgressSlider        from './ProgressSlider';
import ResultDetails         from './result-details.jsx';
import ResultOverlay         from './result-overlay.jsx';
import { getTimePercentage } from './helpers';
import Money                 from '../money.jsx';
import { UnderlyingIcon }    from '../underlying-icon.jsx';
import Button                from '../../Form/button.jsx';

class PositionsDrawerCard extends React.PureComponent {
    state = {
        is_shade_on: false,
    }

    handleShade = (shade) => {
        this.setState({ is_shade_on: shade });
    }

    render() {
        const {
            active_position,
            className,
            contract_info,
            currency,
            current_tick,
            duration,
            duration_unit,
            exit_spot,
            indicative,
            id,
            is_loading,
            is_sell_requested,
            is_valid_to_sell,
            profit_loss,
            onClickSell,
            onClickRemove,
            openContract,
            result,
            sell_price,
            sell_time,
            server_time,
            status,
            type,
        } = this.props;
        const percentage = getTimePercentage(server_time, contract_info.purchase_time, contract_info.date_expiry);
        return (

            <div className={classNames(
                'positions-drawer-card__wrapper', {
                    'positions-drawer-card__wrapper--active': (parseInt(active_position) === id),
                },
                className)}
            >
                <ResultOverlay
                    contract_id={id}
                    onClickRemove={onClickRemove}
                    onClick={openContract}
                    result={result}
                    is_shade_visible={this.state.is_shade_on}
                />
                <ContractLink
                    className={classNames(
                        'positions-drawer-card', {
                            'positions-drawer-card--active': (parseInt(active_position) === id),
                            'positions-drawer-card--green' : (profit_loss > 0) && !result,
                            'positions-drawer-card--red'   : (profit_loss < 0) && !result,
                        }
                    )}
                    contract_id={id}
                >
                    <React.Fragment>
                        <div className={classNames(
                            'positions-drawer-card__grid',
                            'positions-drawer-card__grid-underlying-trade'
                        )}
                        >
                            <div className='positions-drawer-card__underlying-name'>
                                <UnderlyingIcon market={contract_info.underlying} />
                                <span className='positions-drawer-card__symbol'>
                                    {contract_info.display_name}
                                </span>
                            </div>
                            <div className='positions-drawer-card__type'>
                                <ContractTypeCell type={type} />
                            </div>
                        </div>
                        <ProgressSlider
                            is_loading={is_loading}
                            remaining_time={contract_info.date_expiry}
                            percentage={percentage}
                            current_tick={current_tick}
                            ticks_count={contract_info.tick_count}
                            has_result={!!(result)}
                        />
                        <div className={classNames(
                            'positions-drawer-card__grid',
                            'positions-drawer-card__grid-profit-payout'
                        )}
                        >
                            <div className={classNames(
                                'positions-drawer-card__profit-loss',
                                'positions-drawer-card__profit-loss-label',
                            )}
                            >
                                {result ? localize('Profit/Loss:') : localize('Potential profit/loss:')}
                            </div>
                            <div className={classNames(
                                'positions-drawer-card__indicative',
                                'positions-drawer-card__indicative-label',
                            )}
                            >
                                {!result ? localize('Indicative Price:') : localize('Payout:')}
                            </div>
                            <div className={classNames(
                                'positions-drawer-card__profit-loss', {
                                    'positions-drawer-card__profit-loss--negative': (profit_loss < 0),
                                    'positions-drawer-card__profit-loss--positive': (profit_loss > 0),
                                })}
                            >
                                <Money amount={Math.abs(profit_loss)} currency={currency} />
                                <div className={classNames(
                                    'positions-drawer-card__indicative--movement', {
                                        'positions-drawer-card__indicative--movement-complete': !!result,
                                    },
                                )}
                                >
                                    <IconPriceMove
                                        type={(status !== 'complete') ? status : null}
                                    />
                                </div>
                            </div>
                            <div className='positions-drawer-card__indicative'>
                                <Money amount={sell_price || indicative} currency={currency} />
                                <div className={classNames(
                                    'positions-drawer-card__indicative--movement', {
                                        'positions-drawer-card__indicative--movement-complete': !!result,
                                    },
                                )}
                                >
                                    <IconPriceMove
                                        type={(status !== 'complete') ? status : null}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='positions-drawer-card__purchase-price'>
                            <span className='positions-drawer-card__purchase-label'>
                                {localize('Purchase price')}
                            </span>
                            <Money amount={contract_info.buy_price} currency={currency} />
                        </div>
                        <div className='positions-drawer-card__payout-price'>
                            <span className='positions-drawer-card__payout-label'>
                                {localize('Potential payout')}
                            </span>
                            <Money amount={contract_info.payout} currency={currency} />
                        </div>
                    </React.Fragment>
                </ContractLink>
                <CSSTransition
                    in={!!(is_valid_to_sell)}
                    timeout={250}
                    classNames={{
                        enter    : 'positions-drawer-card__sell-button--enter',
                        enterDone: 'positions-drawer-card__sell-button--enter-done',
                        exit     : 'positions-drawer-card__sell-button--exit',
                    }}
                    unmountOnExit
                >
                    <div className='positions-drawer-card__sell-button'>
                        <Button
                            className={classNames(
                                'btn--primary',
                                'btn--primary--green',
                                'btn--sell', {
                                    'btn--loading': is_sell_requested,
                                })}
                            is_disabled={!is_valid_to_sell || is_sell_requested}
                            text={localize('Sell contract')}
                            onClick={() => onClickSell(id)}
                        />
                    </div>
                </CSSTransition>
                <ResultDetails
                    contract_info={contract_info}
                    contract_end_time={sell_time}
                    is_shade_visible={this.handleShade}
                    duration={duration}
                    duration_unit={duration_unit}
                    exit_spot={exit_spot}
                    has_result={!!(result)}
                />
            </div>
        );
    }
}

PositionsDrawerCard.propTypes = {
    active_position: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    className        : PropTypes.string,
    contract_info    : PropTypes.object,
    currency         : PropTypes.string,
    current_tick     : PropTypes.number,
    duration         : PropTypes.number,
    duration_unit    : PropTypes.string,
    exit_spot        : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id               : PropTypes.number,
    indicative       : PropTypes.number,
    is_loading       : PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    is_valid_to_sell : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClickRemove    : PropTypes.func,
    onClickSell      : PropTypes.func,
    openContract     : PropTypes.func,
    profit_loss      : PropTypes.number,
    result           : PropTypes.string,
    sell_time        : PropTypes.number,
    server_time      : PropTypes.object,
    status           : PropTypes.string,
    type             : PropTypes.string,
};

export default PositionsDrawerCard;
