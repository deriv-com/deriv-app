import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './sass/contract-card-dialog.scss';

const ContractCardDialog = React.forwardRef(({ children, is_visible, left, toggleDialog, toggle_ref, top }, ref) => {
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    });

    const handleClickOutside = event => {
        if (ref && ref.current && is_visible) {
            if (ref.current.contains(event.target)) {
                event.stopPropagation();
            } else if (!toggle_ref.current.contains(event.target)) {
                toggleDialog(event);
            }
        }
    };

    const dialog = (
        <CSSTransition
            in={is_visible}
            classNames={{
                enter: 'dc-contract-card-dialog--enter',
                enterDone: 'dc-contract-card-dialog--enter-done',
                exit: 'dc-contract-card-dialog--exit',
            }}
            timeout={150}
            unmountOnExit
        >
            <div
                ref={ref}
                className='dc-contract-card-dialog'
                style={{
                    top,
                    left: `calc(${left}px + 32px)`,
                }}
            >
                {children}
            </div>
        </CSSTransition>
    );

    return ReactDOM.createPortal(
        dialog, // use portal to render dialog above ThemedScrollbars container
        document.getElementById('deriv_app')
    );
});

ContractCardDialog.displayName = 'ContractCardDialog';

ContractCardDialog.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    is_visible: PropTypes.bool,
    left: PropTypes.number,
    toggle_ref: PropTypes.object,
    toggleDialog: PropTypes.func,
    top: PropTypes.number,
};

export default ContractCardDialog;
