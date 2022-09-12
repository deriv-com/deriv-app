import React, { useState } from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import PlatformLauncher from '../platform-launcher/index';
import OptionsAccount from '../account/index';
import AddOptions from '../add-options/index';
import { isMobile } from '@deriv/shared';

type TPlatformLauncherProps = {
    app_icon: string;
    app_title?: string;
    app_desc?: string;
};
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

type TOptionsProps = {
    options_title?: string;
    options_desc?: string;
    platformlauncherprops: TPlatformLauncherPropsArray;
    account_props: Taccount_props;
    addoptions_props: Taddoptions_props;
};
const Options = ({
    options_title,
    options_desc,
    platformlauncherprops,
    account_props,
    addoptions_props,
}: TOptionsProps) => {
    return (
        <div className='options-container'>
            <div className='options-container__title-description-container'>
                {!isMobile() && (
                    <Text className='options-container__title-description-container--title' weight='bold'>
                        <Localize i18n_default_text={options_title} />
                    </Text>
                )}
                <Text className='options-container__title-description-container--description'>
                    <Localize i18n_default_text={options_desc} />
                </Text>
            </div>
            <div className='options-container__accounts-platform-container'>
                <div className='options-container__accounts-platform-container--accounts'>
                    <OptionsAccount {...account_props[1]} />
                    <div className='options-container__accounts-platform-container--add-options'>
                        <AddOptions {...addoptions_props} />
                    </div>
                </div>
                <div className='options-container__accounts-platform-container--platform'>
                    {platformlauncherprops.map(item => {
                        return (
                            <>
                                <PlatformLauncher key={item.app_title} {...item} />
                                {!isMobile() && (
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
