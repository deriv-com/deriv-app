import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Text, ThemedScrollbars } from '@deriv/components';

type TBarriersLIst = {
    active_item_classname: string;
    base_classname: string;
    selected_item: string;
    className: string;
    list: Array<string>;
    onClick: (barrier: string) => void;
    onHover: (barrier: string | null) => void;
};

const BarriersList = ({
    active_item_classname,
    base_classname,
    selected_item,
    className,
    list,
    onClick,
    onHover,
}: TBarriersLIst) => {
    const onMouseEnter = (barrier: string) => {
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
                {localize('Distance to current spot')}
            </Text>
            <ThemedScrollbars autohide={false}>
                <ul className={className}>{barriers_list}</ul>
            </ThemedScrollbars>
        </React.Fragment>
    );
};

export default React.memo(BarriersList);
