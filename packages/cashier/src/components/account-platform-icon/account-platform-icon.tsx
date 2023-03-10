import React from 'react';
import { Icon } from '@deriv/components';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
import { TAccountsList } from 'Types';

type TAccountPlatformIcon = {
    size: number;
    account: TAccountsList['account'];
    icon_class_name?: string;
    appstore_icon_class_name?: string;
    appstoreIconOnClickHandler?: () => void;
};

const AccountPlatformIcon = ({
    account,
    size,
    appstore_icon_class_name,
    appstoreIconOnClickHandler,
}: TAccountPlatformIcon) => {
    return (
        <TradingPlatformIcon
            icon={account.platform_icon}
            size={size}
            className={appstore_icon_class_name}
            onClick={appstoreIconOnClickHandler}
        />
    );
};

export default AccountPlatformIcon;
