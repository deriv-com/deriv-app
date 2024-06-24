import React from 'react';
import classNames from 'classnames';
import 'Sass/app/_common/components/real-signup-banner-dtrader-v2.scss';
import { Text } from '@deriv-com/quill-ui';
import {
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyUsdIcon,
    LabelPairedChevronRightMdRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TRealSignupBannerDTraderV2 = {
    openRealAccount: () => void;
    is_eu?: boolean;
};
const RealSignupBannerDTraderV2 = ({ openRealAccount, is_eu }: TRealSignupBannerDTraderV2) => {
    const banner_icons = {
        eu: [CurrencyEurIcon, CurrencyUsdIcon],
        row: [CurrencyBtcIcon, CurrencyEthIcon, CurrencyUsdIcon],
    };

    return (
        <button className='banner__container' onClick={openRealAccount}>
            <div className='banner'>
                <div
                    className={classNames('banner__currency', {
                        'banner__currency--is-eu': is_eu,
                    })}
                >
                    {is_eu
                        ? banner_icons.eu.map((Icon, idx) => <Icon key={idx} iconSize='md' className='banner__icon' />)
                        : banner_icons.row.map((Icon, idx) => (
                              <Icon key={idx} iconSize='md' className='banner__icon' />
                          ))}
                </div>
                <Text size='md' className='banner__text'>
                    <Localize i18n_default_text='Open a real account now' />
                </Text>
                <LabelPairedChevronRightMdRegularIcon className='banner__arrow' />
            </div>
        </button>
    );
};

export default RealSignupBannerDTraderV2;
