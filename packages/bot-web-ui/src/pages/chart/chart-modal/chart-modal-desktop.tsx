import React, { useEffect } from 'react';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import Draggable from '../../../components/draggable';
import Chart from '..';

const ChartModalDesktop = observer(() => {
    const { dashboard } = useDBotStore();
    const { is_chart_modal_visible, setChartModalVisibility } = dashboard;

    const [screenDimensions, setScreenDimensions] = React.useState({ width: 0, height: 0 });

    const handleResize = () => {
        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const modalWidth = 526;
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
            is_visible={is_chart_modal_visible}
            header_title={localize('Chart')}
            onCloseDraggable={setChartModalVisibility}
            minWidth={modalWidth}
            width={modalWidth}
            height={modalHeight}
            dragHandleClassName='react-rnd-wrapper-header'
        >
            <div className='chart-modal-dialog' data-testid='chart-modal-dialog'>
                <Chart show_digits_stats={false} />
            </div>
        </Draggable>
    );
});

export default ChartModalDesktop;
