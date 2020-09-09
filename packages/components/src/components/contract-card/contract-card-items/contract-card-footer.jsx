import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isValidToCancel, isValidToSell } from '@deriv/shared';
import ToggleCardDialog from './toggle-card-dialog.jsx';
import MultiplierCloseActions from './multiplier-close-actions.jsx';
import Button from '../../button';

const CardFooter = ({
    addToast,
    contract_info,
    getCardLabels,
    getContractById,
    is_multiplier,
    is_positions,
    is_sell_requested,
    onClickCancel,
    onClickSell,
    removeToast,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);
    const show_sell = !!(is_valid_to_sell || (is_multiplier && !contract_info.is_sold));

    if (!show_sell) return null;

    return (
        <CSSTransition
            in={show_sell}
            timeout={250}
            classNames={{
                enter: 'dc-contract-card__sell-button--enter',
                enterDone: 'dc-contract-card__sell-button--enter-done',
                exit: 'dc-contract-card__sell-button--exit',
            }}
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
                        />
                        {(is_valid_to_sell || is_valid_to_cancel) && (
                            <ToggleCardDialog
                                addToast={addToast}
                                contract_id={contract_info.contract_id}
                                getCardLabels={getCardLabels}
                                getContractById={getContractById}
                                is_valid_to_cancel={is_valid_to_cancel}
                                removeToast={removeToast}
                                setCurrentFocus={setCurrentFocus}
                                should_show_cancellation_warning={should_show_cancellation_warning}
                                status={status}
                                toggleCancellationWarning={toggleCancellationWarning}
                            />
                        )}
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
    addToast: PropTypes.func,
    contract_info: PropTypes.object,
    getCardLabels: PropTypes.func,
    getContractById: PropTypes.func,
    is_multiplier: PropTypes.bool,
    is_positions: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
};

export default CardFooter;
