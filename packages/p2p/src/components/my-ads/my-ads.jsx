import React from 'react';
import './my-ads.scss';
import { localize } from 'deriv-translations';
import { MyAdsTable } from './my-ads-table.jsx';

const MyAds = () => {
    return (
        <div>
            <div>{localize('MyAds')}</div>
            <MyAdsTable />
        </div>
    );
};
 
export default MyAds;
