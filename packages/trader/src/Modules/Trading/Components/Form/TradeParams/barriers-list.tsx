import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Text, Icon } from '@deriv/components';
import { CSSTransition } from 'react-transition-group';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import BarriersListBody from './barriers-list-body';

type TBarriersList = {
    barriers_list: string[];
    className: string;
    header: string;
    onClick: (barrier: string) => void;
    onClickCross: () => void;
    onHover?: (barrier: string | null) => void;
    selected_item: string;
    show_table: boolean;
    subheader?: string;
};

const BarriersList = ({ className, header, onClickCross, show_table, ...props }: TBarriersList) => (
    <React.Fragment>
        <DesktopWrapper>
            <CSSTransition
                appear
                in={show_table}
                timeout={250}
                classNames={{
                    appear: `${className}--enter`,
                    enter: `${className}--enter`,
                    enterDone: `${className}--enter-done`,
                    exit: `${className}--exit`,
                }}
                unmountOnExit
            >
                <Fieldset className={classNames('trade-container__fieldset', className)}>
                    <div className={`${className}__header`}>
                        <Text color='prominent' weight='bold' size='xs'>
                            {localize('{{header}}', { header })}
                        </Text>
                        <div className={`${className}__icon-close`} onClick={onClickCross}>
                            <Icon icon='IcCross' />
                        </div>
                    </div>
                    <BarriersListBody className={className} {...props} />
                </Fieldset>
            </CSSTransition>
        </DesktopWrapper>
        <MobileWrapper>
            <BarriersListBody className={className} {...props} />
        </MobileWrapper>
    </React.Fragment>
);

export default React.memo(BarriersList);
