import React from 'react';
import clsx from 'clsx';
import './OrderStatusTag.scss';

type TOrderStatusTagProps = {
    shouldHighlightAlert?: boolean;
    shouldHighlightDanger?: boolean;
    shouldHighlightDisabled?: boolean;
    shouldHighlightSuccess?: boolean;
    status: string;
};

const OrderStatusTag = ({
    shouldHighlightAlert = false,
    shouldHighlightDanger = false,
    shouldHighlightDisabled = false,
    shouldHighlightSuccess = false,
    status,
}: TOrderStatusTagProps) => {
    return (
        <div
            className={clsx('p2p-v2-order-status-tag', {
                'p2p-v2-order-status-tag--alert': shouldHighlightAlert,
                'p2p-v2-order-status-tag--danger': shouldHighlightDanger,
                'p2p-v2-order-status-tag--disabled': shouldHighlightDisabled,
                'p2p-v2-order-status-tag--success': shouldHighlightSuccess,
            })}
        >
            {status}
        </div>
    );
};

export default OrderStatusTag;
