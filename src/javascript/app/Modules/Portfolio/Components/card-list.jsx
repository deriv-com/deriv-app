import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import PropTypes                      from 'prop-types';
import PortfolioCard                  from './portfolio-card.jsx';

const CardList = ({ data, currency }) => (
    <div className='card-list'>
        {
            data.map((portfolio_position, id) => (
                <PortfolioCard
                    key={id}
                    {...portfolio_position}
                    currency={currency}
                />
            ))
        }
    </div>
);

CardList.propTypes = {
    currency: PropTypes.string,
    data    : MobxPropTypes.arrayOrObservableArray,
};

export default CardList;
