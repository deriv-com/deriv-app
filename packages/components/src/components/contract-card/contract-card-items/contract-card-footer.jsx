import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isValidToCancel, isValidToSell } from '@deriv/shared';
import MultiplierCloseActions from './multiplier-close-actions.jsx';
import Button from '../../button';

const CardFooter = ({
    contract_info,
    getCardLabels,
    is_multiplier,
    is_positions,
    is_sell_requested,
    onClickCancel,
    onClickSell,
    onFooterEntered,
    server_time,
    should_show_transition,
}) => {
    const [in_prop, setInProp] = React.useState(!should_show_transition);
    React.useEffect(() => {
        if (should_show_transition) setInProp(true);
    }, [should_show_transition]);

    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);
    const show_sell = !!(is_valid_to_sell || (is_multiplier && !contract_info.is_sold));

    if (!show_sell) return null;

    return (
        <CSSTransition
            in={in_prop}
            timeout={should_show_transition ? 250 : 0}
            classNames={
                should_show_transition
                    ? {
                          enter: 'dc-contract-card__sell-button--enter',
                          enterDone: 'dc-contract-card__sell-button--enter-done',
                          exit: 'dc-contract-card__sell-button--exit',
                      }
                    : {}
            }
            onEntered={onFooterEntered}
            unmountOnExit
        >
            <div className='dc-contract-card-item__footer'>
                {is_multiplier ? (
                    <div
                        className={classNames('dc-contract-card__sell-button', {
                            'dc-contract-card__sell-button--has-cancel-btn': is_valid_to_cancel,
                            'dc-contract-card__sell-button--positions': is_positions,
                        })}
                    >
                        <MultiplierCloseActions
                            className='dc-btn--sell'
                            contract_info={contract_info}
                            getCardLabels={getCardLabels}
                            is_sell_requested={is_sell_requested}
                            onClickCancel={onClickCancel}
                            onClickSell={onClickSell}
                            server_time={server_time}
                        />
                    </div>
                ) : (
                    <div
                        className={classNames('dc-contract-card__sell-button', {
                            'dc-contract-card__sell-button--positions': is_positions,
                        })}
                    >
                        <Button
                            id={`dc_contract_card_${contract_info.contract_id}_button`}
                            className={classNames('dc-btn--sell', {
                                'dc-btn--loading': is_sell_requested,
                            })}
                            is_disabled={!is_valid_to_sell || is_sell_requested}
                            text={getCardLabels().SELL_CONTRACT}
                            onClick={() => onClickSell(contract_info.contract_id)}
                            secondary
                        />
                    </div>
                )}
            </div>
        </CSSTransition>
    );
};

CardFooter.propTypes = {
    contract_info: PropTypes.object,
    getCardLabels: PropTypes.func,
    is_multiplier: PropTypes.bool,
    is_positions: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    onFooterEntered: PropTypes.func,
    should_show_transition: PropTypes.bool,
};

export default CardFooter;
