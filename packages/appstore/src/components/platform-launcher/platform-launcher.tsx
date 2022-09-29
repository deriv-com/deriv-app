import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { routes } from '@deriv/shared';
import { useHistory } from 'react-router-dom';

type TPlatformLauncherProps = {
    icon: string;
    title?: string;
    description?: string;
    link_to: string;
    has_real_account: boolean;
};

const PlatformLauncher = ({ icon, title, description, link_to, has_real_account }: TPlatformLauncherProps) => {
    const history = useHistory();
    const onClickTrade = (url_path: string) => {
        //history.push(routes[url_path]);
        window.location.href = url_path;
    };

    return (
        <div className={`platform-launcher ${has_real_account ? '' : 'applauncher'}`}>
            <div className='platform-launcher__container'>
                <div className='platform-launcher__container--icon'>
                    <WalletIcon icon={icon} />
                </div>
                <div className='platform-launcher__container--title-desc-wrapper'>
                    <Text className='platform-launcher__container--title-desc-wrapper--title' weight='bold'>
                        <Localize i18n_default_text={title} />
                    </Text>
                    <Text className='platform-launcher__container--title-desc-wrapper--description'>
                        <Localize i18n_default_text={description} />
                    </Text>
                </div>
            </div>
            {has_real_account && (
                <div className='platform-launcher__trade-button'>
                    <Button primary small onClick={() => onClickTrade(link_to)} type='button'>
                        <Localize i18n_default_text='Trade' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PlatformLauncher;
