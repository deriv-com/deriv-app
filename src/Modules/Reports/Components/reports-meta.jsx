import React from 'react';

const ReportsMeta = ({ i18n_heading, i18n_message, filter_component }) => (
    <div className='reports__meta'>
        <div className='reports__meta-description'>
            <h1 className='reports__meta-description--heading'>
                { i18n_heading }
            </h1>
            <p className='reports__meta-description--paragraph'>
                { i18n_message }
            </p>
        </div>
        {filter_component &&
        <div className='reports__meta-filter'>
            { filter_component }
        </div>
        }
    </div>
);

export { ReportsMeta };
