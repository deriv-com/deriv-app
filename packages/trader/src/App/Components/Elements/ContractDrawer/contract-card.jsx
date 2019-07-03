import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const ContractCard = ({ children, profit_loss, is_sold }) => (
    <div className={classNames(
        'contract-card', {
            'contract-card--green': (profit_loss > 0) && !is_sold,
            'contract-card--red'  : (profit_loss < 0) && !is_sold,
        })}
    >
        {children}
    </div>
);

ContractCard.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    is_sold    : PropTypes.bool,
    profit_loss: PropTypes.number,
};

export default ContractCard;
