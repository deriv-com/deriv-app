import React from 'react';

const Page404 = () => (
    <div className='container'>
        <div className='page_404 static_full'>
            <div className='gr-row'>
                <div className='gr-12'>
                    <h1>{it.L('Oops... Page Not Available')}</h1>
                </div>
                <div className='gr-8 gr-12-m gr-12-p gr-6-t'>
                    <p>{it.L('The page you requested could not be found. Either it no longer exists or the address is wrong. Please check for any typos.')}</p>
                    <p>{it.L('[_1]Return to trading page[_2]', `<a href="${it.url_for('trading')}">`, '</a>')}</p>
                </div>
                <div className='gr-4 gr-12-m gr-12-p gr-6-t'>
                    <div className='big-error-code'>404</div>
                </div>
            </div>
        </div>
    </div>
);

export default Page404;
