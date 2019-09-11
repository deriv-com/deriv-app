import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import MobileDialog      from '../../Elements/mobile-dialog.jsx';

const ContractTypeDialog = ({
    children,
    is_mobile,
    open,
    onClose,
}) => (
    is_mobile ?
        <React.Fragment>
            <span className='contract-type-widget__select-arrow' />
            <MobileDialog
                title='Select Trading Type'
                visible={open}
                onClose={onClose}
            >
                {children}
            </MobileDialog>
        </React.Fragment>
        :
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
);

ContractTypeDialog.propTypes = {
    children : PropTypes.element,
    is_mobile: PropTypes.bool,
    onClose  : PropTypes.func,
    open     : PropTypes.bool,
};

export default ContractTypeDialog;
