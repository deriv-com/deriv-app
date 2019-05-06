import React from 'react';

const MFSA = () => {
    const style = {
        display: 'none',
    };
    return (
        <div style={style} className='container mfsa_message'>
            <div className='notice-msg center-text gr-parent gr-child'>
                <p>{it.L('In the EU, financial binary options are only available to professional investors.')}</p>
            </div>
        </div>
    );
};

export default MFSA;
