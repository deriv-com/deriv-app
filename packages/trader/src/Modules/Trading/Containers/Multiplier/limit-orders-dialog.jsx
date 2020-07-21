import React from 'react';
import { MobileDialog } from '@deriv/components';
import StopLoss from 'Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss.jsx';
import TakeProfit from 'Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit.jsx';
import CancelDeal from 'Modules/Trading/Components/Elements/Multiplier/cancel-deal-mobile.jsx';

const LimitOrdersDialog = ({ is_open, onClose }) => {
    return (
        <MobileDialog portal_element_id='modal_root' visible={is_open} has_content_scroll onClose={onClose}>
            <div className='trade-params__multiplier-limit-orders'>
                <TakeProfit />
                <StopLoss />
                <CancelDeal />
            </div>
        </MobileDialog>
    );
};

export default LimitOrdersDialog;
