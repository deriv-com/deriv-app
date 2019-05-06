import React from 'react';

const OutdatedBrowserMessage = () => (
    <div id='outdated_browser_message' className='invisible' style={{ display: 'none' }}>
        {it.L('Your web browser ([_1]) is out of date and may affect your trading experience. Proceed at your own risk. [_2]Update browser[_3]', '{brow_name}', '<a href="https://www.whatbrowser.org/" target="_blank">', '</a>')}
    </div>
);

export default OutdatedBrowserMessage;
