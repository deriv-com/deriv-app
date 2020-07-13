import classNames from 'classnames';
import React from 'react';

const ReportsMeta = ({ i18n_heading, i18n_message, filter_component, className, optional_component }) => (
    <div className={classNames('reports__meta', className)}>
        {i18n_heading && (
            <div className='reports__meta-description'>
                <h1 className='reports__meta-description--heading'>{i18n_heading}</h1>
                <p className='reports__meta-description--paragraph'>{i18n_message}</p>
            </div>
        )}

        {optional_component}
        {filter_component && <div className='reports__meta-filter'>{filter_component}</div>}
    </div>
);

export { ReportsMeta };
