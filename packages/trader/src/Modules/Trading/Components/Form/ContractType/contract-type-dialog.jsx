import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import {
    DesktopWrapper,
    MobileDialog,
    MobileWrapper }      from '@deriv/components';
import { localize }      from '@deriv/translations';

const ContractTypeDialog = ({
    children,
    open,
    onClose,
}) => (
    <React.Fragment>
        <MobileWrapper>
            <span className='contract-type-widget__select-arrow' />
            <MobileDialog
                portal_element_id='deriv_app'
                title={localize('Trade type')}
                wrapper_classname='contracts-modal-list'
                visible={open}
                onClose={onClose}
            >
                {children}
            </MobileDialog>
        </MobileWrapper>
        <DesktopWrapper>
            <CSSTransition
                in={open}
                timeout={100}
                classNames={{
                    enter    : 'contracts-type-dialog--enter',
                    enterDone: 'contracts-type-dialog--enterDone',
                    exit     : 'contracts-type-dialog--exit',
                }}
                unmountOnExit
            >
                <div className='contracts-type-dialog'>
                    <div className='contracts-type-dialog__list-wrapper'>
                        {children}
                    </div>
                </div>
            </CSSTransition>
        </DesktopWrapper>
    </React.Fragment>
);

ContractTypeDialog.propTypes = {
    children: PropTypes.element,
    onClose : PropTypes.func,
    open    : PropTypes.bool,
};

export default ContractTypeDialog;
