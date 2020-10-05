import classNames from 'classnames';
import React from 'react';

const ReportsMeta = ({ filter_component, className, optional_component }) => (
    <div className={classNames('reports__meta', className)}>
        {optional_component}
        {filter_component && <div className='reports__meta-filter'>{filter_component}</div>}
    </div>
);

export { ReportsMeta };
