import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';

import './static-platform-launcher.scss';

type TPlatformLauncherProps = {
    app_icon: string;
    app_title?: string;
    app_desc?: string;
    has_applauncher_account?: boolean;
    is_item_blurry?: boolean;
};

const PlatformLauncher = ({
    app_icon,
    app_title,
    app_desc,
    has_applauncher_account,
    is_item_blurry,
}: TPlatformLauncherProps) => {
    return (
        <div className='static-platform-launcher'>
            <div className='static-platform-launcher__container'>
                <div
                    className={
                        is_item_blurry
                            ? 'static-platform-launcher__container--icon--blurry'
                            : 'static-platform-launcher__container--icon'
                    }
                >
                    <WalletIcon icon={app_icon} />
                </div>
                <div className='static-platform-launcher__container--title-desc-wrapper'>
                    <Text weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'} size='xs'>
                        <Localize i18n_default_text={app_title} />
                    </Text>
                    <Text color={is_item_blurry ? 'less-prominent' : 'prominent'} size='xxs'>
                        <Localize i18n_default_text={app_desc} />
                    </Text>
                </div>
            </div>
            {has_applauncher_account && (
                <Button primary className='static-platform-launcher__trade-button'>
                    <Localize i18n_default_text='Trade' />
                </Button>
            )}
        </div>
    );
};

export default PlatformLauncher;
