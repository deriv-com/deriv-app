import React from 'react';
import { isMobile } from '@deriv/shared';
import { Text, ThemedScrollbars } from '@deriv/components';
import classNames from 'classnames';

type TBarriersListBody = {
    barriers_list: string[];
    className?: string;
    onClick: (barrier: string) => void;
    onHover?: (barrier: string | null) => void;
    selected_item: string;
    subheader?: string;
};

const BarriersListBody = ({
    barriers_list,
    className,
    onClick,
    onHover,
    selected_item,
    subheader,
}: TBarriersListBody) => {
    const onMouseEnter = (barrier: string) => {
        if (selected_item !== barrier && onHover) {
            onHover(barrier);
        }
    };
    return (
        <React.Fragment>
            {subheader && (
                <Text
                    size={isMobile() ? 's' : 'xxs'}
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
                            line_height={isMobile() ? 'xl' : 'l'}
                            size={isMobile() ? 'xs' : 'xxs'}
                            as='li'
                            key={barrier}
                            id={barrier}
                            data-testid={barrier}
                            className={classNames(`${className}__item`, {
                                [`${className}__item--selected`]: selected_item === barrier,
                            })}
                            onClick={() => onClick(barrier)}
                            onMouseEnter={() => onMouseEnter(barrier)}
                            onMouseLeave={() => onHover && onHover(null)}
                        >
                            {barrier}
                        </Text>
                    ))}
                </ul>
            </ThemedScrollbars>
        </React.Fragment>
    );
};

export default React.memo(BarriersListBody);
