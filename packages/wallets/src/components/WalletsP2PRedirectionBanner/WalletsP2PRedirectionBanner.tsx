import React from 'react';
import {
    CurrencyP2PIcon,
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { redirectToStandaloneP2P } from '../../helpers/urls';
import useIsRtl from '../../hooks/useIsRtl';
import './WalletsP2PRedirectionBanner.scss';

const WalletsP2PRedirectionBanner: React.FC = () => {
    const isRtl = useIsRtl();

    return (
        <div
            className='wallets-p2p-redirection-banner'
            data-testid='dt_wallets_p2p_redirection_banner'
            onClick={() => redirectToStandaloneP2P()}
            onKeyDown={() => redirectToStandaloneP2P()}
        >
            <CurrencyP2PIcon />
            <Text align='start' className='wallets-p2p-redirection-banner__description' size='sm'>
                <Localize i18n_default_text='Easily exchange USD with local currency using Deriv P2P.' />
            </Text>
            {isRtl ? <LabelPairedChevronLeftCaptionRegularIcon /> : <LabelPairedChevronRightCaptionRegularIcon />}
        </div>
    );
};

export default WalletsP2PRedirectionBanner;
