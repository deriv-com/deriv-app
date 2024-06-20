import React from 'react';
import classNames from 'classnames';
import 'Sass/app/_common/components/banner-dtrader-v2.scss';
import { Text } from '@deriv-com/quill-ui';
import {
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyUsdIcon,
    LabelPairedChevronRightMdRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TBannerDTraderV2 = {
    openRealAccount: () => void;
    is_eu?: boolean;
};
const BannerDTraderV2 = ({ openRealAccount, is_eu }: TBannerDTraderV2) => (
    <button className='banner__container' onClick={openRealAccount}>
        <div className='banner'>
            <div
                className={classNames('banner__currency', {
                    'banner__currency--is-eu': is_eu,
                })}
            >
                {is_eu ? (
                    <React.Fragment>
                        <CurrencyEurIcon iconSize='md' className='icon-1' />
                        <CurrencyUsdIcon iconSize='md' className='icon-2' />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <CurrencyBtcIcon iconSize='md' className='icon-1' />
                        <CurrencyEthIcon iconSize='md' className='icon-2' />
                        <CurrencyUsdIcon iconSize='md' className='icon-3' />
                    </React.Fragment>
                )}
            </div>
            <Text size='md' className='banner__text'>
                <Localize i18n_default_text='Open a real account now' />
            </Text>
            <LabelPairedChevronRightMdRegularIcon className='banner__arrow' />
        </div>
    </button>
);

export default BannerDTraderV2;
