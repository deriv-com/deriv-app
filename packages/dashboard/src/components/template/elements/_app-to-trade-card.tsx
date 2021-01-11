import * as React from 'react';
import classNames from 'classnames';
import { Text, Icon, Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { localize } from '@deriv/translations';

const AppToTradeCard: React.FC<TAppToTradeCardProps> = ({ icon, title, sub_title, is_big_size }) => {
    return (
        <React.Fragment>
            <div
                className={classNames('dw-element-template__app-to-trade-card', {
                    'dw-element-template__app-to-trade-card--big-size': is_big_size,
                })}
            >
                <Icon icon={icon} size={is_big_size ? 108 : 80} />
                <div
                    className={classNames('dw-element-template__app-to-trade-card-container', {
                        'dw-element-template__app-to-trade-card-container--big-size': is_big_size,
                    })}
                >
                    <Text size='xs' weight='bold' line_height='l'>
                        {title}
                    </Text>
                    <Text size='xxs' color='less-prominent' line_height='m'>
                        {sub_title}
                    </Text>
                    <div className='dw-element-template__app-to-trade-card-wrapper'>
                        <Link to='/' className='dw-element-template__app-to-trade-card-link'>
                            {localize('Try demo')}
                        </Link>
                        <Button type='button' text={localize('Get')} primary />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

type TAppToTradeCardProps = {
    icon: string;
    is_big_size: boolean;
    sub_title: string;
    title: string;
};

export default observer(AppToTradeCard);
