import React from 'react';
import { Text } from '@deriv/components';
import { mobileOSDetect } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import GetOnAppleAppStore from 'Assets/svgComponents/get-on-apple-app-store.svg';
import GetOnGooglePlayStore from 'Assets/svgComponents/get-on-google-play-store.svg';
import Dp2pAppIcon from 'Assets/svgComponents/dp2p-app-icon.svg';
import './download.scss';

const Download = () => {
    const os = mobileOSDetect();
    const is_ios_app_released = false; // TODO: Delete this when iOS app is public.
    const is_ios = os === 'iOS' && is_ios_app_released;
    const app_store_url = is_ios
        ? 'http://itunes.apple.com/lb/app/truecaller-caller-id-number/id448142450?mt=8'
        : 'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.deriv.dp2p';

    return (
        <div className='p2p-verification__download'>
            <Dp2pAppIcon />
            <div className='p2p-verification__text'>
                <Text color='prominent' size='s' line_height='m' weight='bold'>
                    <Localize i18n_default_text='DP2P is ready for you' />
                </Text>
            </div>
            <a className='p2p-verification__app-store' href={app_store_url} rel='noopener noreferrer'>
                {is_ios ? <GetOnAppleAppStore /> : <GetOnGooglePlayStore />}
            </a>
        </div>
    );
};

export default Download;
