import React   from 'react';
import Loading from '../../../../../templates/_common/components/loading.jsx';

const ChartLoader = () => (
    <div className='chart-container__loader'>
        <Loading theme='chart-loader' />
    </div>
);

export default ChartLoader;
