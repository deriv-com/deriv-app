import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
// import { NavLink } from 'react-router-dom'; // TODO: Change this after making decision of nav link on mobile
import { Button, Icon, Money } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import Shortcode from 'Modules/Reports/Helpers/shortcode';
import { localize } from '@deriv/translations';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import ContractTypeCell from './contract-type-cell.jsx';
import ProgressSliderMobile from './ProgressSliderMobile';
import ResultOverlay from './result-overlay.jsx';

const PositionsModalCard = ({
    className,
    contract_info,
    currency,
    current_tick,
    indicative,
    id,
    is_loading,
    is_sell_requested,
    is_unsupported,
    is_valid_to_sell,
    profit_loss,
    onClickSell,
    onClickRemove,
    result,
    sell_price,
    status,
    toggleUnsupportedContractModal,
    type,
}) => {
    const loader_el = (
        <div className='positions-drawer-modal__content-loader'>
            <PositionsCardLoader speed={2} />
        </div>
    );
    const fallback_result = profit_loss < 0 ? 'lost' : 'won';
    const contract_el = (
        <React.Fragment>
            <div className={classNames('positions-drawer-modal__grid', 'positions-drawer-modal__grid-header')}>
                <div className='positions-drawer-modal__underlying-name'>
                    <Icon
                        icon={contract_info.underlying ? `IcUnderlying${contract_info.underlying}` : 'IcUnknown'}
                        size={34}
                    />
                    <span className='positions-drawer-modal__symbol'>{contract_info.display_name}</span>
                </div>
                <div className='positions-drawer-modal__type'>
                    <ContractTypeCell
                        type={type}
                        is_high_low={Shortcode.isHighLow({ shortcode: contract_info.shortcode })}
                    />
                </div>
                <CSSTransition
                    in={!!is_valid_to_sell}
                    timeout={250}
                    classNames={{
                        enter: 'positions-drawer-modal__sell-button--enter',
                        enterDone: 'positions-drawer-modal__sell-button--enter-done',
                        exit: 'positions-drawer-modal__sell-button--exit',
                    }}
                    unmountOnExit
                >
                    <div className='positions-drawer-modal__sell-button'>
                        <Button
                            id={`dt_drawer_card_${id}_button`}
                            className={classNames('btn--sell', {
                                'btn--loading': is_sell_requested,
                            })}
                            is_disabled={!is_valid_to_sell || is_sell_requested}
                            text={localize('Sell')}
                            onClick={() => onClickSell(id)}
                            secondary
                        />
                    </div>
                </CSSTransition>
            </div>
            <div className={classNames('positions-drawer-modal__grid', 'positions-drawer-modal__grid-body')}>
                <div className={classNames('positions-drawer-modal__grid-profit-payout')}>
                    <div
                        className={classNames(
                            'positions-drawer-modal__profit-loss',
                            'positions-drawer-modal__profit-loss-label'
                        )}
                    >
                        {result ? localize('Profit/Loss:') : localize('Potential profit/loss:')}
                    </div>
                    <div
                        className={classNames(
                            'positions-drawer-modal__indicative',
                            'positions-drawer-modal__indicative-label'
                        )}
                    >
                        {!result ? localize('Indicative price:') : localize('Payout:')}
                    </div>
                    <div
                        className={classNames('positions-drawer-modal__profit-loss', {
                            'positions-drawer-modal__profit-loss--is-crypto': CurrencyUtils.isCryptocurrency(currency),
                            'positions-drawer-modal__profit-loss--negative': profit_loss < 0,
                            'positions-drawer-modal__profit-loss--positive': profit_loss > 0,
                        })}
                    >
                        <Money amount={Math.abs(profit_loss)} currency={currency} />
                        <div
                            className={classNames('positions-drawer-modal__indicative--movement', {
                                'positions-drawer-modal__indicative--movement-complete': !!result,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </div>
                    <div className='positions-drawer-modal__indicative'>
                        <Money amount={sell_price || indicative} currency={currency} />
                        <div
                            className={classNames('positions-drawer-modal__indicative--movement', {
                                'positions-drawer-modal__indicative--movement-complete': !!result,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </div>
                </div>
                <div className={classNames('positions-drawer-modal__grid-price-payout')}>
                    <div className='positions-drawer-modal__purchase-price'>
                        <span className='positions-drawer-modal__purchase-label'>{localize('Purchase price:')}</span>
                        <span className='positions-drawer-modal__purchase-value'>
                            <Money amount={contract_info.buy_price} currency={currency} />
                        </span>
                    </div>
                    <div className='positions-drawer-modal__payout-price'>
                        <span className='positions-drawer-modal__payout-label'>{localize('Potential payout:')}</span>
                        <span className='positions-drawer-modal__payout-value'>
                            {contract_info.payout ? (
                                <Money amount={contract_info.payout} currency={currency} />
                            ) : (
                                <strong>-i</strong>
                            )}
                        </span>
                    </div>
                </div>

                {result || !!contract_info.is_sold ? (
                    <div
                        className={classNames(
                            'positions-progress-slider-mobile--completed',
                            'positions-drawer-modal__progress'
                        )}
                    />
                ) : (
                    <ProgressSliderMobile
                        className='positions-drawer-modal__progress'
                        is_loading={is_loading}
                        start_time={contract_info.date_start}
                        expiry_time={contract_info.date_expiry}
                        current_tick={current_tick}
                        ticks_count={contract_info.tick_count}
                    />
                )}
            </div>
        </React.Fragment>
    );

    return (
        <div id={`dt_drawer_card_${id}`} className={classNames('positions-drawer-modal__wrapper', className)}>
            {/* TODO: Discuss about this overlay on mobile */}
            <ResultOverlay
                contract_id={id}
                is_unsupported={is_unsupported}
                is_visible={!!contract_info.is_sold}
                onClickRemove={onClickRemove}
                onClick={() => toggleUnsupportedContractModal(true)}
                result={result || fallback_result}
            />
            {/* TODO: Discuss about this navlink on mobile */}
            <div className={classNames('positions-drawer-modal')}>
                {contract_info.underlying ? contract_el : loader_el}
            </div>
            {/* {is_unsupported ? (
                <div
                    className={classNames('positions-drawer-modal', {
                        // 'positions-drawer-modal--green': profit_loss > 0 && !result,
                        // 'positions-drawer-modal--red': profit_loss < 0 && !result,
                    })}
                    onClick={() => toggleUnsupportedContractModal(true)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </div>
            ) : (
                <NavLink
                    className={classNames('positions-drawer-modal', {
                        // 'positions-drawer-modal--green': profit_loss > 0 && !result,
                        // 'positions-drawer-modal--red': profit_loss < 0 && !result,
                    })}
                    to={{
                        pathname: `/contract/${id}`,
                        state: {
                            // from_table_row: true,
                        },
                    }}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </NavLink>
            )} */}
        </div>
    );
};

PositionsModalCard.propTypes = {
    className: PropTypes.string,
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    current_tick: PropTypes.number,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id: PropTypes.number,
    indicative: PropTypes.number,
    is_loading: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    is_unsupported: PropTypes.bool,
    is_valid_to_sell: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClickRemove: PropTypes.func,
    onClickSell: PropTypes.func,
    profit_loss: PropTypes.number,
    result: PropTypes.string,
    sell_time: PropTypes.number,
    status: PropTypes.string,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default PositionsModalCard;
