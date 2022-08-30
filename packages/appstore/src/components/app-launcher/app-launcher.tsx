import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Icon, Money } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Button, Text } from '@deriv/ui';

export interface TAppLauncherProps extends HTMLAttributes<HTMLDivElement> {
    icon_name: string;
    app_name: string;
    jurisdiction: string;
    is_app_installed: boolean;
    balance?: number;
    currency?: string;
    description?: string;
    handleClick?: () => void;
    show_active_balance?: boolean;
    button_className?: string;
}

const AppLauncher = ({
    icon_name,
    app_name,
    jurisdiction,
    is_app_installed,
    balance = 0,
    currency,
    description,
    handleClick,
    show_active_balance,
    button_className,
    ...props
}: TAppLauncherProps) => {
    const getHeightWidthOfIcon = () => {
        return isMobile()
            ? {
                  width: 48,
                  height: 48,
              }
            : {
                  width: 64,
                  height: 64,
              };
    };

    return (
        <div className='app-launcher' {...props}>
            <div>
                <Icon icon={icon_name} width={getHeightWidthOfIcon().width} height={getHeightWidthOfIcon().height} />
            </div>
            <div>
                <Text type='paragraph-2' bold={!is_app_installed || show_active_balance}>
                    {app_name} {jurisdiction}
                </Text>
                {is_app_installed && !show_active_balance && (
                    <Text type='paragraph-2' bold={true}>
                        <Money currency={currency} amount={balance} should_format={false} show_currency={true} />
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
                    className={classNames('app-launcher__button', button_className)}
                    color={is_app_installed ? 'primary' : 'primary-light'}
                    onClick={handleClick}
                >
                    {is_app_installed ? localize('Trade') : localize('Get')}
                </Button>
            )}
            {show_active_balance && isMobile() && (
                <div className='app-launcher__balance'>
                    <Text type='paragraph-2' bold={false}>
                        {localize('Currency')}
                    </Text>
                    <Text type='subtitle-2' bold={true}>
                        <Money currency={currency} amount={balance} should_format={false} show_currency={true} />
                    </Text>
                </div>
            )}
        </div>
    );
};
export default AppLauncher;
