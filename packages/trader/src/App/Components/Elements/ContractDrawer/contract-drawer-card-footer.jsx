import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import React from 'react';
import { Button } from '@deriv/components';
import ContractCardFooter from 'App/Components/Elements/ContractCard/contract-card-footer.jsx';
import TogglePositionsDrawerDialog from 'App/Components/Elements/PositionsDrawer/toggle-positions-drawer-dialog.jsx';
import { localize } from '@deriv/translations';
import { isValidToCancel, isValidToSell } from 'Stores/Modules/Contract/Helpers/logic';
import MultiplierCloseActions from '../PositionsDrawer/PositionsDrawerCard/multiplier-close-actions.jsx';

const CardFooter = ({ contract_info, is_multiplier, is_sell_requested, onClickCancel, onClickSell }) => {
    const { contract_id, is_sold } = contract_info;
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);
    return (
        <ContractCardFooter>
            <CSSTransition
                in={!!(isValidToSell(contract_info) || (is_multiplier && !is_sold))}
                timeout={250}
                classNames={{
                    enter: 'contract-card__sell-button--enter',
                    enterDone: 'contract-card__sell-button--enter-done',
                    exit: 'contract-card__sell-button--exit',
                }}
                unmountOnExit
            >
                {is_multiplier ? (
                    <div
                        className={classNames('contract-card__sell-button', {
                            'contract-card__sell-button--has-cancel-btn': is_valid_to_cancel,
                        })}
                    >
                        <MultiplierCloseActions
                            className='dc-btn--sell'
                            contract_info={contract_info}
                            is_sell_requested={is_sell_requested}
                            onClickCancel={onClickCancel}
                            onClickSell={onClickSell}
                        />
                        {(is_valid_to_sell || is_valid_to_cancel) && (
                            <TogglePositionsDrawerDialog contract_id={contract_id} />
                        )}
                    </div>
                ) : (
                    <div className='contract-card__sell-button'>
                        <Button
                            className={classNames('dc-btn--sell', {
                                'dc-btn--loading': is_sell_requested,
                            })}
                            is_disabled={!isValidToSell(contract_info) || is_sell_requested}
                            text={localize('Sell contract')}
                            onClick={() => onClickSell(contract_id)}
                            secondary
                        />
                    </div>
                )}
            </CSSTransition>
        </ContractCardFooter>
    );
};

CardFooter.propTypes = {
    contract_info: PropTypes.object,
    is_multiplier: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
};

export default CardFooter;
