import React from 'react';
import Loading from '../../../templates/app/components/loading';

type ChartLoaderProps = {
    is_dark: boolean;
    is_visible: boolean;
};

const ChartLoader = ({ is_dark, is_visible }: ChartLoaderProps) =>
    is_visible ? (
        <div className='chart-container__loader'>
            <Loading theme={is_dark ? 'dark' : 'light'} />
        </div>
    ) : null;

export default ChartLoader;
