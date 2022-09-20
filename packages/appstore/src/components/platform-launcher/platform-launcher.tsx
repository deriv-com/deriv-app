import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';

type TPlatformLauncherProps = {
    app_icon: string;
    app_title?: string;
    app_desc?: string;
    has_account?: boolean;
};

const PlatformLauncher = ({ app_icon, app_title, app_desc, has_account }: TPlatformLauncherProps) => {
    return (
        <div className='platform-launcher'>
            <div className='platform-launcher__container'>
                <div className='platform-launcher__container--icon'>
                    <WalletIcon icon={app_icon} />
                </div>
                <div className='platform-launcher__container--title-desc-wrapper'>
                    <Text className='platform-launcher__container--title-desc-wrapper--title' weight='bold'>
                        <Localize i18n_default_text={app_title} />
                    </Text>
                    <Text className='platform-launcher__container--title-desc-wrapper--description'>
                        <Localize i18n_default_text={app_desc} />
                    </Text>
                </div>
            </div>
            {has_account && (
                <div className='platform-launcher__trade-button'>
                    <Button primary small onClick={undefined} type='button'>
                        <Localize i18n_default_text='Trade' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PlatformLauncher;
