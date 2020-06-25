import React from 'react';
import { Button } from '@deriv/components';
import { localize } from 'Components/i18next';
import PlayStoreIcon from 'Assets/svgComponents/logo-play-store.svg';
import './download.scss';

const Download = () => (
    <div className='p2p-verification__download'>
        <PlayStoreIcon />
        <div className='p2p-verification__text'>{localize('DP2P is ready for you')}</div>
        <Button large primary>
            {localize('Install / Open')}
        </Button>
    </div>
);

export default Download;
