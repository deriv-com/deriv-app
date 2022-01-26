import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import { SwipeableWrapper } from '@deriv/components';

type SwipeableContractDrawerProps = {
    children: React.ReactNode;
    onSwipedDown: () => void;
    onSwipedUp: () => void;
};

type SwipeableContractAuditProps = {
    is_multiplier: boolean;
    children: React.ReactNode;
    onSwipedDown: () => void;
};

/**
 * Swipeable components
 */
export const SwipeableContractAudit = ({ is_multiplier, children, onSwipedDown }: SwipeableContractAuditProps) => {
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

export const SwipeableContractDrawer = ({ children, onSwipedDown, onSwipedUp }: SwipeableContractDrawerProps) => {
    const swipe_handlers = SwipeableWrapper.useSwipeable({
        onSwipedDown,
        onSwipedUp,
    });

    return <div {...swipe_handlers}>{children}</div>;
};
