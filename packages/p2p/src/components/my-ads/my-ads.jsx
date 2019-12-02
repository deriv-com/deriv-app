import React from 'react';
import './my-ads.scss';
import { localize } from 'deriv-translations';

const MyAds = () => {
    return <div>
        <Button primary>{localize('Create ads')}</Button>
    </div>;
};
 
export default MyAds;
