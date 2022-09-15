import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import PlatformLauncher from '../platform-launcher/index';
import OptionsAccount from '../account/index';
import AddOptions from '../add-options/index';
import { isMobile } from '@deriv/shared';
import AppsLauncher from '../app-launcher/index';

type Taccount_props = {
    account_icon: string;
    account_icon_mobile: string;
    account_title?: string;
    account_number?: string;
    account_balance?: string;
    currency?: string;
    account_button?: string;
}[];
type TPlatformLauncherPropsArray = { app_icon: string; app_title: string; app_desc: string }[];
type Taddoptions_props = {
    onClickHandler: () => void;
    class_names?: string;
    title: string;
    description: string;
};
type Tapplauncher_props = {
    icon_name: string;
    app_name: string;
    jurisdiction: string;
    is_app_installed: boolean;
    balance: number;
    currency: string;
    description: string;
    show_active_balance: boolean;
};
type TOptionsProps = {
    options_title?: string;
    is_app_launcher: boolean;
    platformlauncherprops: TPlatformLauncherPropsArray;
    account_props: Taccount_props;
    addoptions_props: Taddoptions_props;
    applauncher_props: Tapplauncher_props;
};
const Options = ({ options_title, is_app_launcher, platformlauncherprops, account_props, addoptions_props, applauncher_props }: TOptionsProps) => {
    return (
        <div className={`options-container ${is_app_launcher ? 'options-container-app-launcher' : ''}`}>
            <div className='options-container__title-description-container'>
                {!isMobile() && (
                    <Text className='options-container__title-description-container--title' weight='bold'>
                        <Localize i18n_default_text={options_title} />
                    </Text>
                )}
                <Text className='options-container__title-description-container--description'>
                    <Localize
                        key={1}
                        i18n_default_text='Earn fixed payouts by predicting price movements with <0>Options</0>, or combine the upside of CFDs with the simpliciy of Options with <1>Multipliers</1>'
                        components={[
                            <StaticUrl key={0} className='link' href='trade-types/options/' />,
                            <StaticUrl key={1} className='link' href='trade-types/multiplier/' />,
                        ]}
                    />
                </Text>
            </div>
            <div className='options-container__accounts-platform-container'>
                {!is_app_launcher ? (
                    <div className='options-container__accounts-platform-container--accounts'>
                        <OptionsAccount {...account_props[1]} />
                        <div className='options-container__accounts-platform-container--add-options'>
                            <AddOptions {...addoptions_props} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <AppsLauncher {...applauncher_props} />
                    </div>
                )}
                {is_app_launcher && <span className='options-container__accounts-platform-container--divider' />}
                <div
                    className={`options-container__accounts-platform-container--platform ${
                        is_app_launcher ? 'options-container__accounts-platform-container--platform-with-applauncher' : ''
                    }`}
                >
                    {platformlauncherprops.map((item, index) => {
                        return (
                            <>
                                <PlatformLauncher key={item.app_title} {...item} app_launcher={is_app_launcher} />
                                {!isMobile() && platformlauncherprops.length - 1 !== index && (
                                    <span className='options-container__accounts-platform-container--platform--divider' />
                                )}
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Options;
