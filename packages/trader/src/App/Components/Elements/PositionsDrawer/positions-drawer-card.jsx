import classNames              from 'classnames';
import PropTypes               from 'prop-types';
import React                   from 'react';
import { CSSTransition }       from 'react-transition-group';
import { NavLink }             from 'react-router-dom';
import {
    Button,
    Money,
    UnderlyingIcon }           from 'deriv-components';
import CurrencyUtils           from 'deriv-shared/utils/currency';
import Shortcode               from 'Modules/Reports/Helpers/shortcode';
import { localize }            from 'deriv-translations';
import Icon                    from 'Assets/icon.jsx';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import ContractTypeCell        from './contract-type-cell.jsx';
import ProgressSlider          from './ProgressSlider';
import ResultOverlay           from './result-overlay.jsx';

const PositionsDrawerCard = ({
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
        <div className='positions-drawer-card__content-loader'>
            <PositionsCardLoader speed={2} />
        </div>
    );
    const fallback_result = (profit_loss < 0) ? 'lost' : 'won';
    const contract_el = (
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
                    <ContractTypeCell
                        type={type}
                        is_high_low={Shortcode.isHighLow({ shortcode: contract_info.shortcode })}
                    />
                </div>
            </div>
            {(result || !!(contract_info.is_sold)) ?
                <div className='progress-slider--completed' />
                :
                <ProgressSlider
                    is_loading={is_loading}
                    start_time={contract_info.date_start}
                    expiry_time={contract_info.date_expiry}
                    current_tick={current_tick}
                    ticks_count={contract_info.tick_count}
                />
            }
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
                    {!result ? localize('Indicative price:') : localize('Payout:')}
                </div>
                <div className={classNames(
                    'positions-drawer-card__profit-loss', {
                        'positions-drawer-card__profit-loss--is-crypto': CurrencyUtils.isCryptocurrency(currency),
                        'positions-drawer-card__profit-loss--negative' : (profit_loss < 0),
                        'positions-drawer-card__profit-loss--positive' : (profit_loss > 0),
                    })}
                >
                    <Money amount={Math.abs(profit_loss)} currency={currency} />
                    <div className={classNames(
                        'positions-drawer-card__indicative--movement', {
                            'positions-drawer-card__indicative--movement-complete': !!result,
                        },
                    )}
                    >
                        <Icon
                            icon='IconPriceMove'
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
                        <Icon
                            icon='IconPriceMove'
                            type={(status !== 'complete') ? status : null}
                        />
                    </div>
                </div>
            </div>
            <div className={classNames(
                'positions-drawer-card__grid',
                'positions-drawer-card__grid-price-payout',
            )}
            >
                <div className='positions-drawer-card__purchase-price'>
                    <span className='positions-drawer-card__purchase-label'>
                        {localize('Purchase price:')}
                    </span>
                    <span className='positions-drawer-card__purchase-value'>
                        <Money amount={contract_info.buy_price} currency={currency} />
                    </span>
                </div>
                <div className='positions-drawer-card__payout-price'>
                    <span className='positions-drawer-card__payout-label'>
                        {localize('Potential payout:')}
                    </span>
                    <span className='positions-drawer-card__payout-value'>
                        {contract_info.payout ?
                            <Money amount={contract_info.payout} currency={currency} />
                            :
                            <strong>-</strong>
                        }
                    </span>
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <div
            id={`dt_drawer_card_${id}`}
            className={classNames('positions-drawer-card__wrapper', className)}
        >
            <ResultOverlay
                contract_id={id}
                is_unsupported={is_unsupported}
                is_visible={!!(contract_info.is_sold)}
                onClickRemove={onClickRemove}
                onClick={() => toggleUnsupportedContractModal(true)}
                result={(result || fallback_result)}
            />
            {is_unsupported ?
                <div
                    className={classNames(
                        'positions-drawer-card', {
                            'positions-drawer-card--green': (profit_loss > 0) && !result,
                            'positions-drawer-card--red'  : (profit_loss < 0) && !result,
                        }
                    )}
                    onClick={() => toggleUnsupportedContractModal(true)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </div>
                :
                <NavLink
                    className={classNames(
                        'positions-drawer-card', {
                            'positions-drawer-card--green': (profit_loss > 0) && !result,
                            'positions-drawer-card--red'  : (profit_loss < 0) && !result,
                        }
                    )}
                    to={{
                        pathname: `/contract/${id}`,
                        state   : {
                            // from_table_row: true,
                        },
                    }}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </NavLink>
            }
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
                        id={`dt_drawer_card_${id}_button`}
                        className={classNames(
                            'btn--sell', {
                                'btn--loading': is_sell_requested,
                            })}
                        is_disabled={!is_valid_to_sell || is_sell_requested}
                        text={localize('Sell contract')}
                        onClick={() => onClickSell(id)}
                        secondary
                    />
                </div>
            </CSSTransition>
        </div>
    );
};

PositionsDrawerCard.propTypes = {
    className                     : PropTypes.string,
    contract_info                 : PropTypes.object,
    currency                      : PropTypes.string,
    current_tick                  : PropTypes.number,
    duration                      : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit                 : PropTypes.string,
    exit_spot                     : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id                            : PropTypes.number,
    indicative                    : PropTypes.number,
    is_loading                    : PropTypes.bool,
    is_sell_requested             : PropTypes.bool,
    is_unsupported                : PropTypes.bool,
    is_valid_to_sell              : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClickRemove                 : PropTypes.func,
    onClickSell                   : PropTypes.func,
    profit_loss                   : PropTypes.number,
    result                        : PropTypes.string,
    sell_time                     : PropTypes.number,
    status                        : PropTypes.string,
    toggleUnsupportedContractModal: PropTypes.func,
    type                          : PropTypes.string,
};

export default PositionsDrawerCard;
