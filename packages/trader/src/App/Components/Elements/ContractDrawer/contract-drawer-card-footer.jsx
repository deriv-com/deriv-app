import classNames                  from 'classnames';
import PropTypes                   from 'prop-types';
import { CSSTransition }           from 'react-transition-group';
import React                       from 'react';
import { Button }                  from 'deriv-components';
import ContractCardFooter          from 'App/Components/Elements/ContractCard/contract-card-footer.jsx';
import TogglePositionsDrawerDialog from 'App/Components/Elements/PositionsDrawer/toggle-positions-drawer-dialog.jsx';
import RemainingTime               from 'App/Containers/remaining-time.jsx';
import { localize }                from 'deriv-translations';
import {
    isValidToCancel,
    isValidToSell }                from 'Stores/Modules/Contract/Helpers/logic';

const CardFooter = ({
    contract_info,
    is_multiplier,
    is_sell_requested,
    onClickCancel,
    onClickSell,
}) => {
    const is_valid_to_cancel = isValidToCancel(contract_info);
    return (
        <ContractCardFooter>
            <CSSTransition
                in={!!(isValidToSell(contract_info) || (is_multiplier && !contract_info.is_sold))}
                timeout={250}
                classNames={{
                    enter    : 'contract-card__sell-button--enter',
                    enterDone: 'contract-card__sell-button--enter-done',
                    exit     : 'contract-card__sell-button--exit',
                }}
                unmountOnExit
            >
                {is_multiplier ?
                    <div className={classNames('contract-card__sell-button', {
                        'contract-card__sell-button--has-cancel-btn': is_valid_to_cancel,
                    })}
                    >
                        <Button
                            id={`dt_drawer_card_${contract_info.contract_id}_close_button`}
                            className={classNames(
                                'btn--sell', {
                                    'btn--loading': is_sell_requested,
                                })}
                            is_disabled={is_sell_requested || +contract_info.profit <= 0 && is_valid_to_cancel}
                            text={localize('Close')}
                            onClick={() => onClickSell(contract_info.contract_id, true)}
                            secondary
                        />
                        {is_valid_to_cancel &&
                            <Button
                                id={`dt_drawer_card_${contract_info.contract_id}_cancel_button`}
                                className='btn--cancel'
                                onClick={() => onClickCancel(contract_info.contract_id, true)}
                                secondary
                            >
                                {localize('Cancel')}
                                <RemainingTime
                                    end_time={contract_info.deal_cancellation.date_expiry}
                                    format='mm:ss'
                                />
                            </Button>
                        }
                        <TogglePositionsDrawerDialog contract_id={contract_info.contract_id} />
                    </div>
                    :
                    <div className='contract-card__sell-button'>
                        <Button
                            className={classNames(
                                'btn--sell', {
                                    'btn--loading': is_sell_requested,
                                })}
                            is_disabled={!(isValidToSell(contract_info)) || is_sell_requested}
                            text={localize('Sell contract')}
                            onClick={() => onClickSell(contract_info.contract_id)}
                            secondary
                        />
                    </div>
                }
            </CSSTransition>
        </ContractCardFooter>
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
