import React, { useState } from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import PlatformLauncher from '../platform-launcher/index';

type TPlatformLauncherProps = {
    app_icon?: string;
    app_title?: string;
    app_desc?: string;
};
type TPlatformLauncherPropsArray = { app_icon: string; app_title: string; app_desc: string }[];
type TOptionsProps = {
    options_title?: string;
    options_desc?: string;
    platformlauncherprops: TPlatformLauncherPropsArray;
};

const Options = ({ options_title, options_desc, platformlauncherprops }: TOptionsProps) => {
    return (
        <div className='options-container'>
            <div className='options-container__title-description-container'>
                <Text className='options-container__title-description-container--title' weight='bold'>
                    <Localize i18n_default_text={options_title} />
                </Text>
                <Text className='options-container__title-description-container--description'>
                    <Localize i18n_default_text={options_desc} />
                </Text>
            </div>
            <div className='options-container__accounts-platform-container'>
                <div className='options-container__accounts-platform-container--accounts'>Account</div>
                <div className='options-container__accounts-platform-container--platform'>
                    {platformlauncherprops.map((item, index) => {
                        return (
                            <>
                                <PlatformLauncher key={index} {...item} />
                                <span className='options-container__accounts-platform-container--platform--divider' />
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Options;
