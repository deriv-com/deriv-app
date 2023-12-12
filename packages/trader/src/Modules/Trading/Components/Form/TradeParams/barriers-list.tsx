import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper, Text, Icon } from '@deriv/components';
import { CSSTransition } from 'react-transition-group';
import Fieldset from 'App/Components/Form/fieldset';
import BarriersListBody, { TBarriersListBody } from './barriers-list-body';

type TBarriersList = TBarriersListBody & {
    header: string | React.ReactNode;
    onClickCross: () => void;
    show_table: boolean;
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
                            {header}
                        </Text>
                        <div className={`${className}__icon-close`} onClick={onClickCross}>
                            <Icon icon='IcCross' data_testid={`dt_${className}__icon_close`} />
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
