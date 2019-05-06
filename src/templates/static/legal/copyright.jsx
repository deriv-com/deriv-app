import React from 'react';

const Copyright = () => (
    <div>
        <h2 data-anchor='copyright'>{it.L('Copyright')}</h2>
        <p>{it.L('The [_1] website is protected by certain copyrights.', it.website_name)}</p>
        <p>{it.L('The materials comprising the [_1] website (including without limitation all articles, text, images, logos, compilation, systems, code and design) are Copyright 1999-<span class=\'currentYear\'></span> Binary Group of companies. All rights reserved.', it.website_name)}</p>
        <p>{it.L('Such materials may be copied and distributed on a limited basis for noncommercial purposes only, provided that any material copied remains intact and that all copies include the following notice in a clearly visible position: &ldquo;Copyright 1999-<span class=\'currentYear\'></span> Binary Ltd. All rights reserved.&rdquo;')}</p>
        <p>{it.L('These materials may not be copied or redistributed for commercial purposes or for compensation of any kind without prior written permission from a Binary Group company.')}</p>
        <p>{it.L('[_1] and the bull/bear logo are registered trademarks.', it.website_name)}</p>
    </div>
);

export default Copyright;
