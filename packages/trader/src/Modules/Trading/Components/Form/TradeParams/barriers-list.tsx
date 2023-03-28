import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Text, Icon } from '@deriv/components';
import { CSSTransition } from 'react-transition-group';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import BarrierBody from './barrier-body';

type TBarriersLIst = {
    active_item_classname: string;
    base_classname: string;
    header: string;
    selected_item: string;
    show_table: boolean;
    subheader?: string;
    className: string;
    list: Array<string>;
    onClick: (barrier: string) => void;
    onClickCross: () => void;
    onHover?: (barrier: string | null) => void;
};

const BarriersList = ({
    active_item_classname,
    base_classname,
    header,
    selected_item,
    show_table,
    subheader,
    className,
    list,
    onClick,
    onClickCross,
    onHover,
}: TBarriersLIst) => {
    const onMouseEnter = (barrier: string) => {
        if (selected_item !== barrier && onHover) {
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
                onMouseLeave={() => onHover && onHover(null)}
            >
                {barrier}
            </Text>
        );
    });

    return (
        <React.Fragment>
            <DesktopWrapper>
                <CSSTransition
                    appear
                    in={show_table}
                    timeout={250}
                    classNames={{
                        appear: 'trade-container__barriers-table--enter',
                        enter: 'trade-container__barriers-table--enter',
                        enterDone: 'trade-container__barriers-table--enter-done',
                        exit: 'trade-container__barriers-table--exit',
                    }}
                    unmountOnExit
                >
                    <Fieldset className='trade-container__fieldset trade-container__barriers-table'>
                        <div className='trade-container__barriers-table__header'>
                            <Text color='prominent' weight='bold' size='xs'>
                                {localize('{{header}}', { header })}
                            </Text>
                            <div className='trade-container__barriers-table__icon-close' onClick={onClickCross}>
                                <Icon icon='IcCross' />
                            </div>
                        </div>
                        <BarrierBody className={className} subheader={subheader} barriers_list={barriers_list} />
                    </Fieldset>
                </CSSTransition>
            </DesktopWrapper>
            <MobileWrapper>
                <BarrierBody className={className} subheader={subheader} barriers_list={barriers_list} />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default React.memo(BarriersList);
