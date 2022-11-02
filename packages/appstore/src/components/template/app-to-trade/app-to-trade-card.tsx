import * as React from 'react';
import classNames from 'classnames';
import { Text, Icon, Button } from '@deriv/components';
import { Link } from 'react-router-dom';
import { localize } from '@deriv/translations';

const AppToTradeCard: React.FC<TAppToTradeCardProps> = ({ icon, title, subtitle, is_big_size }) => {
    return (
        <div
            className={classNames('dw-app-to-trade__card', {
                'dw-app-to-trade__card--big-size': is_big_size,
            })}
        >
            <Icon icon={icon} size={is_big_size ? 108 : 80} />
            <div
                className={classNames('dw-app-to-trade__card-content-wrapper', {
                    'dw-app-to-trade__card-content-wrapper--big-size': is_big_size,
                })}
            >
                <Text size='xs' weight='bold' line_height='l'>
                    {title}
                </Text>
                <Text size='xxs' color='less-prominent' line_height='m'>
                    {subtitle}
                </Text>
                <div className='dw-app-to-trade__card-button-wrapper'>
                    <Link to='/' className='dw-app-to-trade__card-link'>
                        {localize('Try demo')}
                    </Link>
                    <Button type='button' text={localize('Get')} primary blue />
                </div>
            </div>
        </div>
    );
};

type TAppToTradeCardProps = {
    icon: string;
    is_big_size: boolean;
    subtitle: string;
    title: string;
};

export default AppToTradeCard;
