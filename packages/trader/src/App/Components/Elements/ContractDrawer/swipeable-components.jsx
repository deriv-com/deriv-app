import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { SwipeableWrapper } from '@deriv/components';

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
        <div className='contract-audit-card'>
            <div
                {...swipe_handlers}
                className={classNames('contract-audit-card__container', {
                    'contract-audit-card__container--is-multiplier': is_multiplier,
                })}
            >
                {children}
            </div>
        </div>,
        target_el
    );
};

SwipeableContractAudit.propTypes = {
    is_multiplier: PropTypes.bool,
    children: PropTypes.any,
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
    children: PropTypes.any,
    onSwipedDown: PropTypes.func,
    onSwipedUp: PropTypes.func,
};
