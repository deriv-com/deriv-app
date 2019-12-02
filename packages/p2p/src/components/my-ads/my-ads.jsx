import React from 'react';
import './my-ads.scss';
import { localize } from 'deriv-translations';
import { Button } from 'deriv-components';

const MyAds = () => {
    return <div>
        <Button primary>{localize('Create ads')}</Button>
    </div>;
};
 
export default MyAds;
