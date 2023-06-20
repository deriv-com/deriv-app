import React from 'react';
import Loading from '_common/components/loading';

type TChartLoader = {
    is_dark: boolean;
    is_visible: boolean;
};

const ChartLoader = ({ is_dark, is_visible }: TChartLoader) =>
    is_visible ? (
        <div className='chart-container__loader'>
            <Loading theme={is_dark ? 'dark' : 'light'} />
        </div>
    ) : null;

export default ChartLoader;
