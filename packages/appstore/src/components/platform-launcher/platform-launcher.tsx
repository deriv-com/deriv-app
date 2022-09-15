import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';

type TPlatformLauncherProps = {
    app_icon: string;
    app_title?: string;
    app_desc?: string;
    app_url: string;
    app_launcher: boolean;
};

const PlatformLauncher = ({ app_icon, app_title, app_desc, app_url, app_launcher }: TPlatformLauncherProps) => {
    const history = useHistory();
    const onClickTrade = (url_path: string) => {
        history.push(routes[url_path]);
    };

    return (
        <div className={`platform-launcher ${app_launcher ? 'applauncher' : ''}`}>
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
            {!app_launcher && (
                <div className='platform-launcher__trade-button'>
                    <Button primary small onClick={() => onClickTrade(app_url)} type='button'>
                        <Localize i18n_default_text='Trade' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PlatformLauncher;
