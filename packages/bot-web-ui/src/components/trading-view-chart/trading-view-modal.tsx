import React from 'react';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import Draggable from 'Components/draggable';
import TradingViewComponent from 'Components/trading-view-chart/trading-view';
import { useDBotStore } from 'Stores/useDBotStore';

const TradingViewModal = observer(() => {
    const { dashboard } = useDBotStore();
    const { is_trading_view_modal_visible, setTradingViewModalVisibility } = dashboard;

    const [screenDimensions, setScreenDimensions] = React.useState({ width: 0, height: 0 });

    const handleResize = () => {
        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);

        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const modalWidth = 540;
    const modalHeight = 524;

    const xAxisValue = (screenDimensions.width - modalWidth) / 2;
    const yAxisValue = (screenDimensions.height - modalHeight) / 2;

    const yaxis = yAxisValue >= 0 ? yAxisValue : 0;
    const xaxis = xAxisValue >= 0 ? xAxisValue : 0;

    return (
        <Draggable
            bounds='.main'
            xaxis={xaxis}
            yaxis={yaxis}
            is_visible={is_trading_view_modal_visible}
            header_title={localize('TradingView Chart')}
            onCloseDraggable={setTradingViewModalVisibility}
            minWidth={modalWidth}
            width={modalWidth}
            height={modalHeight}
            dragHandleClassName='react-rnd-wrapper-header'
        >
            <div style={{ height: 'calc(100% - 5rem)', padding: '0.5rem' }}>
                <TradingViewComponent />
            </div>
        </Draggable>
    );
});

export default TradingViewModal;
