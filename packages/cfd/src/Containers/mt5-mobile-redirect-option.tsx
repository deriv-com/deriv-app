import React from 'react';
import './mt5-mobile-redirect-option.scss';
import { ButtonLink, Icon, StaticUrl, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getDownloadOptions } from '../Helpers/constants';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

type TMT5MobileRedirectOptionProps = {
    mt5_trade_account: DetailsOfEachMT5Loginid;
};
const MT5MobileRedirectOption = ({ mt5_trade_account }: TMT5MobileRedirectOptionProps) => {
    const mobileDownloadOptions = getDownloadOptions({ mt5_trade_account }).filter(
        option => option.device === 'mobile'
    );

    return (
        <div className='mt5-download-container'>
            {mobileDownloadOptions.map(option => (
                <ButtonLink
                    key={option.icon}
                    className={`mt5-download-container--option ${option.highlight ? 'blue' : ''}`}
                    onClick={() => {
                        window.open(option.href, '_blank');
                    }}
                >
                    <Icon icon={option.icon} size={16} />
                    <Text as='p' align='left' size='xxs' weight='bold'>
                        <Localize i18n_default_text={option.text} />
                    </Text>
                    <Icon icon={option.highlight ? 'IcChevronRightLight' : 'IcChevronRight'} size={16} />
                </ButtonLink>
            ))}

            <Text as='p' size='xxxs'>
                <Localize
                    i18n_default_text="Note: Don't have the MT5 app? Tap the <0>Trade with MT5 mobile app</0> button to download. Once you have
                installed the app, return to this screen and hit the same button to log in."
                    components={[<strong key={0} />]}
                />
            </Text>

            <Text as='p' align='center' size='xxs'>
                <Localize
                    i18n_default_text='For MT5 login issues, visit our <0>Help Centre</0>.'
                    components={[
                        <StaticUrl
                            key={0}
                            className='help-center-link'
                            href='/help-centre/dmt5/#log-in-to-my-Deriv-MT5-account'
                        />,
                    ]}
                />
            </Text>
        </div>
    );
};

export default MT5MobileRedirectOption;
