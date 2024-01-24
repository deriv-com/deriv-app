import React from 'react';
import classNames from 'classnames';

const NewHorizontalCarousel = () => {
    const filters = ['All', 'Digital', 'Accumulators', 'Vanillas', 'Turbos', 'Multipliers', 'Ups&Downs', 'Highs&Lows'];

    return (
        <React.Fragment>
            {filters.map((filter, index) => (
                <span
                    key={index}
                    className={classNames('filter_item', {
                        'filter_item--selected': filter === 'All',
                    })}
                >
                    {filter}
                </span>
            ))}
        </React.Fragment>
    );
};

export default NewHorizontalCarousel;
