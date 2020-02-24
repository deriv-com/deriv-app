import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Div100vhContainer, SwipeableWrapper } from '@deriv/components';

/**
 * Collapsible components with swipe gestures for mobile views
 */
export const CollapsibleContractAudit = ({ children, onSwipedDown }) => {
    const swipe_handlers = SwipeableWrapper.useSwipeable({
        onSwipedDown,
    });

    return ReactDOM.createPortal(
        <Div100vhContainer className='contract-audit-card' height_offset='220px'>
            <div {...swipe_handlers} style={{ height: '100%' }}>
                {children}
            </div>
        </Div100vhContainer>,
        document.getElementById('dt_contract_replay_container')
    );
};

CollapsibleContractAudit.propTypes = {
    children: PropTypes.node,
    onSwipedDown: PropTypes.func,
};

export const CollapsibleContractDrawer = ({ children, onSwipedDown, onSwipedUp }) => {
    const swipe_handlers = SwipeableWrapper.useSwipeable({
        onSwipedDown,
        onSwipedUp,
    });

    return <div {...swipe_handlers}>{children}</div>;
};

CollapsibleContractDrawer.propTypes = {
    children: PropTypes.node,
    onSwipedDown: PropTypes.func,
    onSwipedUp: PropTypes.func,
};
