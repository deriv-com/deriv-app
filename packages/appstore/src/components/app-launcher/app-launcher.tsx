import React from 'react';
import { Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Button, Text } from '@deriv/ui';

type TAppLauncherProps = {
    icon_name: string;
    app_name: string;
    jurisdiction: string;
    is_app_installed: boolean;
    balance?: number;
    currency?: string;
    description?: string;
    handleClick?: () => void;
    show_active_balance?: boolean;
};

const AppLauncher = ({
    icon_name,
    app_name,
    jurisdiction,
    is_app_installed,
    balance,
    currency,
    description,
    handleClick,
    show_active_balance,
}: TAppLauncherProps) => {
    return (
        <div className='app-launcher'>
            <div>
                <Icon icon={icon_name} width={isMobile() ? 48 : 64} height={isMobile() ? 48 : 64} />
            </div>
            <div>
                <Text type='paragraph-2' bold={!is_app_installed}>
                    {app_name} {jurisdiction}
                </Text>
                {is_app_installed && !show_active_balance && (
                    <Text type='paragraph-2' bold={true}>
                        {balance} {currency}
                    </Text>
                )}
                {(!is_app_installed || show_active_balance) && (
                    <Text type='extra-small' bold={false}>
                        {description}
                    </Text>
                )}
            </div>
            {!show_active_balance && (
                <Button
                    className='app-launcher__button'
                    color={is_app_installed ? 'primary' : 'primary-light'}
                    onClick={handleClick}
                >
                    {localize(is_app_installed ? 'Trade' : 'Get')}
                </Button>
            )}
            {show_active_balance && isMobile() && (
                <div className='app-launcher__balance'>
                    <Text type='paragraph-2' bold={false}>
                        {localize('Currency')}
                    </Text>
                    <Text type='subtitle-2' bold={true}>
                        {balance} {currency}
                    </Text>
                </div>
            )}
        </div>
    );
};
export default AppLauncher;
