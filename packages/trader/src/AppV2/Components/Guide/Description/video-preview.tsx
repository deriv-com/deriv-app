import React from 'react';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedPlayMdFillIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv/translations';
// import { getDescriptionVideoId } from 'Modules/Trading/Helpers/video-config';
import { Stream } from '@cloudflare/stream-react';
import { AVAILABLE_CONTRACTS, CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';

type TVideoPreview = {
    contract_type: string;
};

const VideoPreview = ({ contract_type }: TVideoPreview) => {
    // const contract_name = AVAILABLE_CONTRACTS.find(({ id }) => id === contract_type)?.tradeType;
    type TDtraderVideoUrl = {
        [key: string]: TVideoVariants;
    };

    type TVideoVariants = {
        dark: string;
        light: string;
    };

    /* The video upload feature is not available yet. The following video ids are taken from CF Stream account.
    If considered necessary later, the current approach can be replaced with HTTP-request to fetch videos by their file names. */
    const DESCRIPTION_VIDEO_ID: TDtraderVideoUrl = {
        [CONTRACT_LIST.ACCUMULATORS]: {
            light: 'c1d64d5ffaf449e3326d387a70621a4c',
            dark: '9657e4adcfd9274d41a042b7b6c42d60',
        },
        [CONTRACT_LIST['EVEN/ODD']]: {
            light: 'a3930b0a535c4f23daea5cf98a718941',
            dark: 'e311e25dd68761d6ab73e8158ec83ea4',
        },
        [CONTRACT_LIST['HIGHER/LOWER']]: {
            light: 'f528c662c377601908a741ae2aedaec6',
            dark: '4c05445e1bd28f3f9f95b0ab566c4f9b',
        },
        [CONTRACT_LIST['MATCHES/DIFFERS']]: {
            light: '8693a02397d284ffcf0608e4fda702d9',

            dark: '2e56ad7ea67bf3f9a869de6336df1796',
        },
        [CONTRACT_LIST.MULTIPLIERS]: {
            light: 'bca032791da88023e81ebf7341226f83',
            dark: '3d10e25e2e0eaaf96d1874aae257029f',
        },
        [CONTRACT_LIST['OVER/UNDER']]: {
            light: '9e2be907cba9b38352890e52cfd8cbaf',

            dark: '4b31fc188c2f365faa310f7e34715af7',
        },
        [CONTRACT_LIST['RISE/FALL']]: {
            light: '7719c7e5436f58e59ab47510445108ba',
            dark: 'b72ef7ec914afe3dbb2a1601cad3a76f',
        },
        [CONTRACT_LIST['TOUCH/NO TOUCH']]: {
            light: 'c781a6844f37a3308fe8774b4450dfc9',
            dark: 'c91f2b9859dc95ce8eecf7df327aaf00',
        },
        [CONTRACT_LIST.VANILLAS]: {
            light: '9b8b6ae67d3a720e4aee2665889d17fb',
            dark: '8f04e9d768b8e08a1d87830c95c6b9c8',
        },
    };

    const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
        DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];

    return (
        <div className='guide-video__wrapper'>
            <div className='guide-video__preview'>
                <Stream
                    autoplay={false}
                    controls={false}
                    className='guide-video'
                    letterboxColor='transparent'
                    muted
                    preload='auto'
                    responsive={false}
                    src={getDescriptionVideoId('accumulator', false)}
                    width='112px'
                    height='73px'
                />
                <div className='guide-video__preview__icon__wrapper'>
                    <LabelPairedPlayMdFillIcon className='guide-video__preview__icon' />
                </div>
            </div>
            <div className='guide-video__description'>
                <CaptionText bold color='quill-typography__color--default'>
                    {localize(`How to trade ${contract_type}?`)}
                </CaptionText>
                <CaptionText>
                    <Localize i18n_default_text='Watch this video to learn about this trade type.' />
                </CaptionText>
            </div>
        </div>
    );
};

export default VideoPreview;
