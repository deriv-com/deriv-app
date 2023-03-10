import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Text, ThemedScrollbars } from '@deriv/components';

const BarriersList = ({ active_item_classname, base_classname, selected_item, className, list, onClick, onHover }) => {
    const onMouseEnter = barrier => {
        if (selected_item !== barrier) {
            onHover(barrier);
        }
    };

    const barriers_list = list.map(barrier => {
        const genetated_class_name = `${base_classname} ${selected_item === barrier ? active_item_classname : ''}`;

        return (
            <Text
                color='prominent'
                line_height={isMobile() ? 'xl' : 'l'}
                size={isMobile() ? 'xs' : 'xxs'}
                as='li'
                key={barrier}
                id={barrier}
                data-testid={barrier}
                className={genetated_class_name}
                onClick={() => onClick(barrier)}
                onMouseEnter={() => onMouseEnter(barrier)}
                onMouseLeave={() => onHover(null)}
            >
                {barrier}
            </Text>
        );
    });

    return (
        <React.Fragment>
            <Text
                size={isMobile() ? 's' : 'xxs'}
                color='disabled'
                line_height='l'
                as='p'
                className='trade-container__barriers-table__text'
            >
                {localize('Distance to spot')}
            </Text>
            <ThemedScrollbars height={isMobile() ? 'calc(100% - 5.5rem)' : null} autohide={false}>
                <ul className={className}>{barriers_list}</ul>
            </ThemedScrollbars>
        </React.Fragment>
    );
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
