import React from 'react';
import { Button } from '@deriv/components';
import { mobileOSDetect } from '@deriv/shared';
import { localize } from 'Components/i18next';
import PlayStoreIcon from 'Assets/svgComponents/logo-play-store.svg';
import './download.scss';

const openStore = () => {
    if (mobileOSDetect() === 'Android') {
        window.location.href =
            'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.deriv.dp2p';
    }
    // uncomment when iOS app is ready
    // if (mobileOSDetect() === 'iOS') {
    //     window.location.href = 'http://itunes.apple.com/lb/app/truecaller-caller-id-number/id448142450?mt=8';
    // }
};

const Download = () => (
    <div className='p2p-verification__download'>
        <PlayStoreIcon />
        <div className='p2p-verification__text'>{localize('DP2P is ready for you')}</div>
        <Button large primary onClick={openStore}>
            {localize('Install / Open')}
        </Button>
    </div>
);

export default Download;
