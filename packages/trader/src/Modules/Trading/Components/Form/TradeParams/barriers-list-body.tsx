import React from 'react';
import classNames from 'classnames';
import { Text, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

export type TBarriersListBody = {
    barriers_list: string[];
    className?: string;
    onClick: (barrier: string) => void;
    onHover?: (barrier: string) => void;
    selected_item: string;
    subheader?: string;
};

const BarriersListBody = observer(
    ({ barriers_list, className, onClick, onHover, selected_item, subheader }: TBarriersListBody) => {
        const {
            ui: { is_mobile },
        } = useStore();
        const onMouseEnter = (barrier: string) => {
            if (selected_item !== barrier && typeof onHover === 'function') {
                onHover(barrier);
            }
        };
        return (
            <React.Fragment>
                {subheader && (
                    <Text
                        size={is_mobile ? 's' : 'xxs'}
                        color='disabled'
                        line_height='l'
                        as='p'
                        className={`${className}__text`}
                    >
                        {subheader}
                    </Text>
                )}
                <ThemedScrollbars autohide={false}>
                    <ul className={`${className}__list`}>
                        {barriers_list.map(barrier => (
                            <Text
                                color='prominent'
                                line_height={is_mobile ? 'xl' : 'l'}
                                size={is_mobile ? 'xs' : 'xxs'}
                                as='li'
                                key={barrier}
                                id={barrier}
                                data-testid={barrier}
                                className={classNames(`${className}__item`, {
                                    [`${className}__item--selected`]: selected_item === barrier,
                                })}
                                onClick={() => onClick(barrier)}
                                onMouseEnter={() => onMouseEnter(barrier)}
                                onMouseLeave={() => typeof onHover === 'function' && onHover('')}
                            >
                                {barrier}
                            </Text>
                        ))}
                    </ul>
                </ThemedScrollbars>
            </React.Fragment>
        );
    }
);

export default React.memo(BarriersListBody);
