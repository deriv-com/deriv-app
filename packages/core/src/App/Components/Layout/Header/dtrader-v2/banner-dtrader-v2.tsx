import React from 'react';
import 'Sass/app/_common/components/banner-dtrader-v2.scss';
import { Text } from '@deriv-com/quill-ui';
import {
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyUsdIcon,
    LabelPairedChevronRightMdRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TBannerDtraderV2 = {
    openRealAccount: () => void;
};
const BannerDtraderV2 = ({ openRealAccount }: TBannerDtraderV2) => (
    <button className='banner__container' onClick={openRealAccount}>
        <div className='banner'>
            <div className='banner__currency'>
                <CurrencyBtcIcon iconSize='md' className='icon-1' />
                <CurrencyEthIcon iconSize='md' className='icon-2' />
                <CurrencyUsdIcon iconSize='md' className='icon-3' />
            </div>
            <Text size='md' className='banner__text'>
                <Localize i18n_default_text='Open a real account now' />
            </Text>
            <LabelPairedChevronRightMdRegularIcon className='banner__arrow' />
        </div>
    </button>
);

export default BannerDtraderV2;
