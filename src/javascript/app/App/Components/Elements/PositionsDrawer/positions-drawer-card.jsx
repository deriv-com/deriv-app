import classNames              from 'classnames';
import PropTypes               from 'prop-types';
import React                   from 'react';
import { CSSTransition }       from 'react-transition-group';
import ContractLink            from 'Modules/Contract/Containers/contract-link.jsx';
import { isHighLow }           from 'Modules/Reports/Helpers/market-underlying';
import { isCryptocurrency }    from '_common/base/currency_base';
import { localize }            from '_common/localize';
import Icon                    from 'Assets/icon.jsx';
import Button                  from 'App/Components/Form/button.jsx';
import Money                   from 'App/Components/Elements/money.jsx';
import { UnderlyingIcon }      from 'App/Components/Elements/underlying-icon.jsx';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import ContractTypeCell        from './contract-type-cell.jsx';
import ProgressSlider          from './ProgressSlider';
import ResultOverlay           from './result-overlay.jsx';

const PositionsDrawerCard = ({
    active_position,
    className,
    contract_info,
    currency,
    current_tick,
    indicative,
    id,
    is_dark_theme,
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
            <PositionsCardLoader
                is_dark_theme={is_dark_theme}
                speed={2}
            />
        </div>
    );
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
                        is_high_low={isHighLow(contract_info.shortcode)}
                    />
                </div>
            </div>
            {result ?
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
                        'positions-drawer-card__profit-loss--is-crypto': isCryptocurrency(currency),
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
        <div className={classNames(
            'positions-drawer-card__wrapper', {
                'positions-drawer-card__wrapper--active': (parseInt(active_position) === id),
            },
            className)}
        >
            <ResultOverlay
                contract_id={id}
                is_unsupported={is_unsupported}
                has_same_contract_mounted={id === parseInt(active_position)}
                onClickRemove={onClickRemove}
                onClick={() => toggleUnsupportedContractModal(true)}
                result={result}
            />
            {is_unsupported ?
                <div
                    className={classNames(
                        'positions-drawer-card', {
                            'positions-drawer-card--active': (parseInt(active_position) === id),
                            'positions-drawer-card--green' : (profit_loss > 0) && !result,
                            'positions-drawer-card--red'   : (profit_loss < 0) && !result,
                        }
                    )}
                    onClick={() => toggleUnsupportedContractModal(true)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </div>
                :
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
                    {contract_info.underlying ? contract_el : loader_el}
                </ContractLink>
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
        </div>
    );
};

PositionsDrawerCard.propTypes = {
    active_position: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    className                     : PropTypes.string,
    contract_info                 : PropTypes.object,
    currency                      : PropTypes.string,
    current_tick                  : PropTypes.number,
    duration                      : PropTypes.number,
    duration_unit                 : PropTypes.string,
    exit_spot                     : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id                            : PropTypes.number,
    indicative                    : PropTypes.number,
    is_dark_theme                 : PropTypes.bool,
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
