import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import WalletIcon, { Icons } from 'Assets/svgs/wallet';

import './static-platform-launcher.scss';

type TPlatformLauncherProps = {
    app_icon: keyof typeof Icons;
    app_desc?: string;
    is_grey?: boolean;
    app_title?: string;
    has_applauncher_account?: boolean;
    is_item_blurry?: boolean;
};

const PlatformLauncher = ({
    app_icon,
    app_desc,
    is_grey,
    app_title,
    is_item_blurry,
    has_applauncher_account,
}: TPlatformLauncherProps) => {
    const { client } = useStores();
    const { loginid } = client;

    const is_mf = loginid?.startsWith('MF');

    return (
        <div
            className={classNames('static-platform-launcher', {
                'static-platform-launcher--grey': is_grey,
            })}
        >
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
                    <Text as='h2' weight='bold' color={is_item_blurry ? 'less-prominent' : 'prominent'} size='xs'>
                        <Localize i18n_default_text={app_title} />
                    </Text>
                    <Text as='p' color={is_item_blurry ? 'less-prominent' : 'prominent'} size='xxs'>
                        <Localize i18n_default_text={app_desc} />
                    </Text>
                </div>
                {isMobile() && has_applauncher_account && (
                    <Button primary className='static-platform-launcher__trade-button'>
                        <Localize i18n_default_text='Trade' />
                    </Button>
                )}
            </div>
            {has_applauncher_account && !isMobile() && (
                <Button
                    primary
                    className={classNames('static-platform-launcher__trade-button', {
                        'static-platform-launcher__trade-button--eu': is_mf,
                    })}
                >
                    <Localize i18n_default_text='Trade' />
                </Button>
            )}
        </div>
    );
};

export default observer(PlatformLauncher);
