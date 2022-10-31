import React from 'react';
import { Text, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import WalletIcon, { Icons } from 'Assets/svgs/wallet';
import { isMobile } from '@deriv/shared';
import { Link } from 'react-router-dom';

type TPlatformLauncherProps = {
    app_icon: keyof typeof Icons;
    app_title?: string;
    app_desc?: string;
    link_to?: string;
    href?: string;
    has_real_account: boolean;
};

const PlatformLauncher = ({
    app_icon,
    app_title,
    app_desc,
    link_to,
    href,
    has_real_account,
}: TPlatformLauncherProps) => {
    return (
        <div className={`platform-launcher${has_real_account ? '' : '-applauncher'}`}>
            <div className='platform-launcher__container'>
                <div className='platform-launcher__container--icon'>
                    <WalletIcon icon={app_icon} />
                </div>
                <div className='platform-launcher__container--title-desc-wrapper'>
                    <Text
                        size='xxs'
                        line_height={isMobile() ? 's' : 'l'}
                        className='platform-launcher__container--title-desc-wrapper--title'
                        weight='bold'
                    >
                        <Localize i18n_default_text={app_title} />
                    </Text>
                    <Text
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        line_height='l'
                        className='platform-launcher__container--title-desc-wrapper--description'
                    >
                        <Localize i18n_default_text={app_desc} />
                    </Text>
                </div>
            </div>
            {has_real_account && (
                <React.Fragment>
                    {link_to ? (
                        <Link to={link_to}>
                            <Button primary className='platform-launcher__trade-button'>
                                <Text color='white' weight='bold' size={isMobile() ? 'xxxs' : 's'}>
                                    {localize('Trade')}
                                </Text>
                            </Button>
                        </Link>
                    ) : (
                        <a href={href}>
                            <Button primary className='platform-launcher__trade-button'>
                                <Text color='white' weight='bold' size={isMobile() ? 'xxxs' : 's'}>
                                    {localize('Trade')}
                                </Text>
                            </Button>
                        </a>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default PlatformLauncher;
