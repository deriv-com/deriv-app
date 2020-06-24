import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const ContractCard = ({ is_multiplier, children, profit_loss, is_sold }) => (
    <div
        className={classNames('contract-card', {
            'contract-card--green': !is_multiplier && profit_loss > 0 && !is_sold,
            'contract-card--red': !is_multiplier && profit_loss < 0 && !is_sold,
        })}
    >
        {children}
    </div>
);

ContractCard.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    is_sold: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    profit_loss: PropTypes.number,
};

export default ContractCard;
