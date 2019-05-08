import React from 'react';
import Title from '../../_common/components/title.jsx';

const SessionExpired = () => (
    <html>
        <head>
            <Title />
            { it.css_files.filter(css => /common/.test(css)).map((css_file, inx) => (
                <link key={inx} rel='stylesheet' href={css_file} />
            ))}
        </head>
        <body>
            <div className='center-text' style={{ padding: '10px' }}>
                <p className='notice-msg'>{it.L('Your cashier session has expired. Please try again.')}</p>
            </div>
        </body>
    </html>
);

export default SessionExpired;
