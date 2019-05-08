import React from 'react';

const AssetIndex = () => (
    <div id='asset_index_wrapper' className='gr-centered gr-12-p gr-12-m'>
        <h1>{it.L('Asset Index')}</h1>
        <div className='gr-padding-10'>
            <p id='errorMsg' className='error-msg invisible' />
            <div id='asset-index' className='has-tabs gr-parent' />
            <p className='notice-msg center-text invisible' id='empty-asset-index'>
                {it.L('Asset index is unavailable in this country. If you have an active [_1] account, please [_2]log in[_3] for full access.', it.website_name, '<a id=\'empty-asset-index-btn-login\' href=\'javascript:;\'>', '</a>')}
            </p>
        </div>
    </div>
);

export default AssetIndex;
