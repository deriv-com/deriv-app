import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Div100vhContainer, SwipeableWrapper } from '@deriv/components';

/**
 * Swipeable components
 */
export const SwipeableContractAudit = ({ children, onSwipedDown }) => {
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

SwipeableContractAudit.propTypes = {
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
