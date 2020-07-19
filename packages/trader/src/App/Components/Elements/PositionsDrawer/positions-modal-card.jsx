import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { ContractCard } from '@deriv/components';
import { getContractPath } from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';
import { connect } from 'Stores/connect';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';

const PositionsModalCard = ({
    className,
    contract_info,
    currency,
    id,
    is_sell_requested,
    is_unsupported,
    is_valid_to_sell,
    onClickRemove,
    onClickSell,
    profit_loss,
    result,
    server_time,
    status,
    togglePositions,
    toggleUnsupportedContractModal,
}) => {
    const loader_el = (
        <div className='positions-modal-card__content-loader'>
            <PositionsCardLoader speed={2} />
        </div>
    );
    const contract_el = (
        <React.Fragment>
            <ContractCard
                contract_info={contract_info}
                currency={currency}
                getCardLabels={getCardLabels}
                getContractTypeDisplay={getContractTypeDisplay}
                id={id}
                is_positions={false}
                is_sell_requested={is_sell_requested}
                is_unsupported={is_unsupported}
                is_valid_to_sell={is_valid_to_sell}
                onClickRemove={onClickRemove}
                onClickSell={onClickSell}
                profit_loss={profit_loss}
                result={result}
                server_time={server_time}
                should_show_result_overlay={false}
                status={status}
                toggleUnsupportedContractModal={toggleUnsupportedContractModal}
            />
        </React.Fragment>
    );

    return (
        <div id={`dt_drawer_card_${id}`} className={classNames('positions-modal-card__wrapper', className)}>
            {is_unsupported ? (
                <div
                    className={classNames('positions-modal-card')}
                    onClick={() => toggleUnsupportedContractModal(true)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </div>
            ) : (
                <BinaryLink
                    onClick={togglePositions}
                    className={classNames('positions-modal-card')}
                    to={getContractPath(id)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </BinaryLink>
            )}
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
    server_time: PropTypes.object,
    status: PropTypes.string,
    togglePositions: PropTypes.func,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default connect(({ common }) => ({
    server_time: common.server_time,
}))(PositionsModalCard);
