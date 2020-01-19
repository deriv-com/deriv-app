import PropTypes         from 'prop-types';
import React             from 'react';
import {
    DesktopWrapper,
    MobileDialog,
    MobileWrapper }      from '@deriv/components';
import { CSSTransition } from 'react-transition-group';

const TradeTypeInfoDialog = ({
    children,
    open,
    onClose,
    title,
}) => (
    <React.Fragment>
        <MobileWrapper>
            <MobileDialog
                container_el='deriv_app'
                visible={open}
                onClose={onClose}
                title={title}
                wrapper_classname='trade-type-info-modal'
            >
                {children}
            </MobileDialog>
        </MobileWrapper>
        <DesktopWrapper>
            <CSSTransition
                classNames={{
                    enter    : 'trade-type-info-dialog--enter',
                    enterDone: 'trade-type-info-dialog--enterDone',
                    exit     : 'trade-type-info-dialog--exit',
                }}
                in={open}
                timeout={100}
                unmountOnExit
            >
                <div className='trade-type-info-dialog'>
                    <div className='trade-type-info-dialog__info-wrapper'>
                        {children}
                    </div>
                </div>
            </CSSTransition>
        </DesktopWrapper>
    </React.Fragment>
);

TradeTypeInfoDialog.propTypes = {
    children: PropTypes.element,
    onClose : PropTypes.func,
    open    : PropTypes.bool,
    title   : PropTypes.string,
};

export default TradeTypeInfoDialog;
