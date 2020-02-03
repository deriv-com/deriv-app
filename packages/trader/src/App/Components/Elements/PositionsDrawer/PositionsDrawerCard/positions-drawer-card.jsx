import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';
import CardHeader from './positions-drawer-card-header.jsx';
import CardFooter from './positions-drawer-card-footer.jsx';
import CardBody from './positions-drawer-card-body.jsx';
import ResultOverlay from '../result-overlay.jsx';

const PositionsDrawerCard = ({
    className,
    contract_info,
    currency,
    is_sell_requested,
    is_unsupported,
    profit_loss,
    onClickCancel,
    onClickSell,
    onClickRemove,
    result,
    show_transition,
    status,
    toggleUnsupportedContractModal,
    onMouseEnter,
    onMouseLeave,
}) => {
    const loader_el = (
        <div className='positions-drawer-card__content-loader'>
            <PositionsCardLoader speed={2} />
        </div>
    );

    const fallback_result = profit_loss >= 0 ? 'won' : 'lost';
    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    const contract_el = (
        <React.Fragment>
            <CardHeader contract_info={contract_info} has_progress_slider={!is_multiplier} />
            <CardBody contract_info={contract_info} currency={currency} is_multiplier={is_multiplier} status={status} />
        </React.Fragment>
    );
    // When scrolling fast in react-window, sometimes card is stuck with enter transition class and it is not removed after timeout making the card to be invisible.
    // So added a class based on isScrolling from react-window to show the transition.
    const transition_class = show_transition && 'positions-drawer-card__wrapper--transition';

    return (
        <div
            id={`dt_drawer_card_${contract_info.contract_id}`}
            className={classNames('positions-drawer-card__wrapper', transition_class, className)}
            onMouseEnter={() => {
                onMouseEnter(true, contract_info);
            }}
            onMouseLeave={() => {
                onMouseLeave(false, contract_info);
            }}
            onClick={() => {
                onMouseLeave(false, contract_info);
            }}
        >
            <ResultOverlay
                contract_id={contract_info.contract_id}
                is_unsupported={is_unsupported}
                is_multiplier={is_multiplier}
                is_visible={!!contract_info.is_sold}
                onClickRemove={onClickRemove}
                onClick={() => toggleUnsupportedContractModal(true)}
                result={result || fallback_result}
            />
            {is_unsupported ? (
                <div
                    className={classNames('positions-drawer-card', {
                        'positions-drawer-card--green': profit_loss > 0 && !result,
                        'positions-drawer-card--red': profit_loss < 0 && !result,
                    })}
                    onClick={() => toggleUnsupportedContractModal(true)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </div>
            ) : (
                <NavLink
                    className={classNames('positions-drawer-card', {
                        'positions-drawer-card--green': profit_loss > 0 && !result,
                        'positions-drawer-card--red': profit_loss < 0 && !result,
                    })}
                    to={{
                        pathname: `/contract/${contract_info.contract_id}`,
                        state: {
                            // from_table_row: true,
                        },
                    }}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </NavLink>
            )}
            <CardFooter
                contract_info={contract_info}
                is_multiplier={is_multiplier}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
            />
        </div>
    );
};

PositionsDrawerCard.propTypes = {
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

export default PositionsDrawerCard;
