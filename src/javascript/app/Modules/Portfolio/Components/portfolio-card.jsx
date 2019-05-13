import PropTypes           from 'prop-types';
import React               from 'react';
import { NavLink }         from 'react-router-dom';
import Money               from 'App/Components/Elements/money.jsx';
import { getContractPath } from 'App/Components/Routes/helpers';
import RemainingTime       from 'App/Containers/remaining-time.jsx';

const PortfolioCard = ({
    currency,
    details,
    expiry_time,
    id,
    indicative,
    payout,
    purchase,
    reference,
    status,
}) => (
    <NavLink
        className='portfolio-card card-list__card card-list__card-link'
        activeClassName='active'
        to={getContractPath(id)}
    >
        <div className='portfolio-card__header'>
            <span className='portfolio-card__date'>
                <RemainingTime end_time={expiry_time} />
            </span>
            <span className='portfolio-card__refid'>
                {reference}
            </span>
        </div>
        <div className='portfolio-card__body'>
            <div className='portfolio-card__desc'>{details}</div>
            <div className='portfolio-card__row'>
                <div className='portfolio-card__cell portfolio-card__purchase'>
                    <span className='portfolio-card__cell-text'>
                        <Money amount={purchase} currency={currency} />
                    </span>
                </div>
                <div className='portfolio-card__cell portfolio-card__payout'>
                    <span className='portfolio-card__cell-text'>
                        <Money amount={payout} currency={currency} />
                    </span>
                </div>
                <div className={`portfolio-card__cell portfolio-card__indicative portfolio-card__indicative--${status}`}>
                    <span className='portfolio-card__cell-text'>
                        <Money amount={indicative} currency={currency} />
                    </span>
                </div>
            </div>
        </div>
    </NavLink>
);

PortfolioCard.propTypes = {
    currency   : PropTypes.string,
    details    : PropTypes.string,
    expiry_time: PropTypes.number,
    id         : PropTypes.number,
    indicative : PropTypes.number,
    payout     : PropTypes.number,
    purchase   : PropTypes.number,
    reference  : PropTypes.number,
    status     : PropTypes.string,
};

export default PortfolioCard;
