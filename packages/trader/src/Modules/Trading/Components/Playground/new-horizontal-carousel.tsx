import React from 'react';
import classNames from 'classnames';

const NewHorizontalCarousel = ({ list }: { list: string[] }) => {
    return (
        <React.Fragment>
            {list.map((filter, index) => (
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
