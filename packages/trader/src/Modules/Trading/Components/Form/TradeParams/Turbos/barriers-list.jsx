import PropTypes from 'prop-types';
import React from 'react';

const BarriersList = ({ active_item_classname, base_classname, selected_item, className, list, onClick, onHover }) => {
    const onMouseEnter = barrier => {
        if (selected_item !== barrier) {
            onHover(barrier);
        }
    };

    const barriers_list = list.map(barrier => {
        const genetated_class_name = `${base_classname} ${selected_item === barrier ? active_item_classname : ''}`;

        return (
            <li
                key={barrier}
                id={barrier}
                className={genetated_class_name}
                onClick={() => onClick(barrier)}
                onMouseEnter={() => onMouseEnter(barrier)}
                onMouseLeave={() => onHover(null)}
            >
                {barrier}
            </li>
        );
    });

    return <ul className={className}>{barriers_list}</ul>;
};

BarriersList.propTypes = {
    active_item_classname: PropTypes.string,
    base_classname: PropTypes.string,
    selected_item: PropTypes.string,
    className: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
    onHover: PropTypes.func,
};

export default React.memo(BarriersList);
