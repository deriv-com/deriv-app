import classNames                  from 'classnames';
import PropTypes                   from 'prop-types';
import { CSSTransition }           from 'react-transition-group';
import React                       from 'react';
import { Button }                  from 'deriv-components';
import TogglePositionsDrawerDialog from 'App/Components/Elements/PositionsDrawer/toggle-positions-drawer-dialog.jsx';
import { localize }                from 'deriv-translations';
import {
    isValidToCancel,
    isValidToSell }                from 'Stores/Modules/Contract/Helpers/logic';
import MultiplierCloseActions      from './multiplier-close-actions.jsx';

const CardFooter = ({
    contract_info,
    is_multiplier,
    is_sell_requested,
    onClickCancel,
    onClickSell,
}) => {
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell   = isValidToSell(contract_info);

    return (
        <CSSTransition
            in={!!(is_valid_to_sell || (is_multiplier && !contract_info.is_sold))}
            timeout={250}
            classNames={{
                enter    : 'positions-drawer-card__sell-button--enter',
                enterDone: 'positions-drawer-card__sell-button--enter-done',
                exit     : 'positions-drawer-card__sell-button--exit',
            }}
            unmountOnExit
        >
            {is_multiplier ?
                <div className={classNames('positions-drawer-card__sell-button', {
                    'positions-drawer-card__sell-button--has-cancel-btn': is_valid_to_cancel,
                })}
                >
                    <MultiplierCloseActions
                        className='btn--sell'
                        contract_info={contract_info}
                        is_sell_requested={is_sell_requested}
                        onClickCancel={onClickCancel}
                        onClickSell={onClickSell}
                    />
                    {(is_valid_to_sell || is_valid_to_cancel)
                    && <TogglePositionsDrawerDialog contract_id={contract_info.contract_id} /> }
                </div>
                :
                <div className='positions-drawer-card__sell-button'>
                    <Button
                        id={`dt_drawer_card_${contract_info.contract_id}_button`}
                        className={classNames(
                            'btn--sell', {
                                'btn--loading': is_sell_requested,
                            })}
                        is_disabled={!is_valid_to_sell || is_sell_requested}
                        text={localize('Sell contract')}
                        onClick={() => onClickSell(contract_info.contract_id)}
                        secondary
                    />
                </div>
            }
        </CSSTransition>
    );
};

CardFooter.propTypes = {
    contract_info    : PropTypes.object,
    is_multiplier    : PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickCancel    : PropTypes.func,
    onClickSell      : PropTypes.func,
};

export default CardFooter;
