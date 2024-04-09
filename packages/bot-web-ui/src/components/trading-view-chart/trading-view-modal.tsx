import React from 'react';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import DraggableResizeWrapper from 'Components/draggable/draggable-resize-wrapper';
import TradingViewComponent from 'Components/trading-view-chart/trading-view';
import { useDBotStore } from 'Stores/useDBotStore';

const TradingViewModal = observer(() => {
    const { dashboard } = useDBotStore();
    const { is_trading_view_modal_visible, setTradingViewModalVisibility } = dashboard;

    return (
        <React.Fragment>
            {is_trading_view_modal_visible && (
                <DraggableResizeWrapper
                    boundary='.main'
                    header={localize('TradingView Chart')}
                    onClose={setTradingViewModalVisibility}
                    modalWidth={526}
                    modalHeight={595}
                    minWidth={526}
                    minHeight={524}
                    enableResizing
                >
                    <div style={{ height: 'calc(100% - 6rem)', padding: '0.5rem' }}>
                        <TradingViewComponent />
                    </div>
                </DraggableResizeWrapper>
            )}
        </React.Fragment>
    );
});

export default TradingViewModal;
