import React from 'react';
import { Button, Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
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
        history.push(routes[url_path]);
    };

    return (
        <div className={`platform-launcher ${has_real_account ? '' : 'applauncher'}`}>
            <div className='platform-launcher__container'>
                <div className='platform-launcher__container--icon'>
                    <WalletIcon icon={icon} />
                </div>
                <DesktopWrapper>
                    <div className='platform-launcher__container--title-desc-wrapper'>
                        <Text
                            size='xxs'
                            line_height='l'
                            className='platform-launcher__container--title-desc-wrapper--title'
                            weight='bold'
                        >
                            <Localize i18n_default_text={title} />
                        </Text>
                        <Text
                            size='xxs'
                            line_height='l'
                            className='platform-launcher__container--title-desc-wrapper--description'
                        >
                            <Localize i18n_default_text={description} />
                        </Text>
                    </div>
                </DesktopWrapper>
                <MobileWrapper>
                    <div className='platform-launcher__container--title-desc-wrapper'>
                        <Text
                            size='xxs'
                            line_height='l'
                            className='platform-launcher__container--title-desc-wrapper--title'
                            weight='bold'
                        >
                            <Localize i18n_default_text={title} />
                        </Text>
                        <Text
                            size='xxxs'
                            line_height='l'
                            className='platform-launcher__container--title-desc-wrapper--description'
                        >
                            <Localize i18n_default_text={description} />
                        </Text>
                    </div>
                </MobileWrapper>
            </div>
            {has_real_account && (
                <Button
                    primary
                    onClick={() => onClickTrade(link_to)}
                    type='button'
                    className='platform-launcher__trade-button'
                >
                    <Localize i18n_default_text='Trade' />
                </Button>
            )}
        </div>
    );
};

export default PlatformLauncher;
