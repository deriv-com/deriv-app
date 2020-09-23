import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isValidToCancel } from '@deriv/shared';
import Button from '../../button';
import RemainingTime from '../../remaining-time';

const MultiplierCloseActions = ({
    className,
    contract_info,
    getCardLabels,
    is_sell_requested,
    onClickCancel,
    onClickSell,
    server_time,
}) => {
    const { contract_id, cancellation: { date_expiry: cancellation_date_expiry } = {}, profit } = contract_info;

    const is_valid_to_cancel = isValidToCancel(contract_info);

    return (
        <React.Fragment>
            <Button
                id={`dc_contract_card_${contract_id}_button`}
                className={classNames(className, {
                    'dc-btn--loading': is_sell_requested,
                })}
                is_disabled={is_sell_requested || (+profit < 0 && is_valid_to_cancel)}
                text={getCardLabels().CLOSE}
                onClick={ev => {
                    onClickSell(contract_id);
                    ev.stopPropagation();
                    ev.preventDefault();
                }}
                secondary
            />
            {is_valid_to_cancel && (
                <Button
                    id={`dc_contract_card_${contract_id}_cancel_button`}
                    className='dc-btn--cancel'
                    is_disabled={+profit >= 0}
                    onClick={ev => {
                        onClickCancel(contract_id);
                        ev.stopPropagation();
                        ev.preventDefault();
                    }}
                    secondary
                >
                    {getCardLabels().CANCEL}
                    {cancellation_date_expiry && (
                        <RemainingTime
                            end_time={cancellation_date_expiry}
                            format='mm:ss'
                            getCardLabels={getCardLabels}
                            start_time={server_time}
                        />
                    )}
                </Button>
            )}
        </React.Fragment>
    );
};

MultiplierCloseActions.propTypes = {
    className: PropTypes.string,
    contract_info: PropTypes.object,
    getCardLabels: PropTypes.func,
    is_sell_requested: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    server_time: PropTypes.object,
};

export default MultiplierCloseActions;
