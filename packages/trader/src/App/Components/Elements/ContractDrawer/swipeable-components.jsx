import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Div100vhContainer, SwipeableWrapper } from '@deriv/components';

/**
 * Swipeable components
 */
export const SwipeableContractAudit = ({ is_multiplier, children, onSwipedDown }) => {
    const swipe_handlers = SwipeableWrapper.useSwipeable({
        onSwipedDown,
    });

    const target_el = document.getElementById('dt_contract_drawer_audit');

    if (!target_el) return null;

    return ReactDOM.createPortal(
        <Div100vhContainer className='contract-audit-card' height_offset='220px'>
            <div {...swipe_handlers} style={{ height: is_multiplier ? 'calc(100% - 40px)' : '100%' }}>
                {children}
            </div>
        </Div100vhContainer>,
        target_el
    );
};

SwipeableContractAudit.propTypes = {
    is_multiplier: PropTypes.bool,
    children: PropTypes.node,
    onSwipedDown: PropTypes.func,
};

export const SwipeableContractDrawer = ({ children, onSwipedDown, onSwipedUp }) => {
    const swipe_handlers = SwipeableWrapper.useSwipeable({
        onSwipedDown,
        onSwipedUp,
    });

    return <div {...swipe_handlers}>{children}</div>;
};

SwipeableContractDrawer.propTypes = {
    children: PropTypes.node,
    onSwipedDown: PropTypes.func,
    onSwipedUp: PropTypes.func,
};
