import React from 'react';
import { Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PlayStoreIcon from 'Assets/svgComponents/logo-play-store.svg';
import { useStores } from 'Stores';
import './download.scss';

const Download = observer(() => {
    const { general_store } = useStores();

    return (
        <div className='p2p-verification__download'>
            <PlayStoreIcon />
            <div className='p2p-verification__text'>{localize('DP2P is ready for you')}</div>
            <Button large primary onClick={general_store.openApplicationStore}>
                {localize('Install / Open')}
            </Button>
        </div>
    );
});

export default Download;
