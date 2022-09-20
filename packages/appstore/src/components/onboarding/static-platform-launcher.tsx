import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import WalletIcon from 'Assets/svgs/wallet';

import './static-platform-launcher.scss';

type TPlatformLauncherProps = {
    app_icon: string;
    app_title?: string;
    app_desc?: string;
    has_account?: boolean;
    is_item_blurry?: boolean;
};

const PlatformLauncher = ({ app_icon, app_title, app_desc, has_account, is_item_blurry }: TPlatformLauncherProps) => {
    return (
        <div className='static-platform-launcher'>
            <div className='static-platform-launcher__container'>
                <div
                    className={classNames('static-platform-launcher__container--icon', {
                        is_item_blurry: 'static-platform-launcher__container--icon--blurry',
                    })}
                >
                    <WalletIcon icon={app_icon} />
                </div>
                <div className='static-platform-launcher__container--title-desc-wrapper'>
                    <Text weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                        <Localize i18n_default_text={app_title} />
                    </Text>
                    <Text color={is_item_blurry ? 'less-prominent' : 'prominent'}>
                        <Localize i18n_default_text={app_desc} />
                    </Text>
                </div>
            </div>
            {has_account && (
                <div className='static-platform-launcher__trade-button'>
                    <Button primary small>
                        <Localize i18n_default_text='Trade' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PlatformLauncher;
