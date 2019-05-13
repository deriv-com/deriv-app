import React from 'react';

const ReportsMeta = ({ i18n_heading, i18n_message }) => (
    <div className='reports__meta'>
        <div className='reports__meta-description'>
            <h1 className='reports__meta-description--heading'>
                { i18n_heading }
            </h1>
            <p className='reports__meta-description--paragraph'>
                { i18n_message }
            </p>
        </div>
        {/* TODO: Add Filter component (daterangepicker) */}
        {/* <div className='reports__meta-filter'> */}
        {/*    [FILTER COMPONENT] */}
        {/* </div> */}
    </div>
);

export { ReportsMeta };
