import React from 'react';
import { useScript } from '@deriv/hooks';

const TrustpilotWidget = () => {
    useScript(`//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js`);

    return (
        <div
            className='trustpilot-widget'
            data-locale='en-EN'
            data-template-id='5406e65db0d04a09e042d5fc'
            data-businessunit-id='5ed4c8a9f74f310001f51bf7'
            data-style-height='28px'
            data-style-width='100%'
            data-theme='light'
        >
            <a href='https://www.trustpilot.com/review/deriv.com' target='_blank' rel='noopener noreferrer' />
        </div>
    );
};

export default TrustpilotWidget;
