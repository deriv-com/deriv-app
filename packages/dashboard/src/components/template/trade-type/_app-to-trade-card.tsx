import * as React from 'react';
import { Text, Icon, Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { localize } from '@deriv/translations';

const AppToTradeCard: React.FC<AppToTradeCardProps> = ({ icon, title, sub_title }) => {
    return (
        <React.Fragment>
            <div className='tradetype-template__app-to-trade-card'>
                <Icon icon={icon} size={80} />
                <div className='tradetype-template__app-to-trade-card-container'>
                    <Text size='xs' weight='bold' line_height='xl'>
                        {title}
                    </Text>
                    <Text size='xxs' color='less-prominent' line_height='l'>
                        {sub_title}
                    </Text>
                    <div className='tradetype-template__app-to-trade-card-wrapper'>
                        <Link to='/' key={0} className='tradetype-template__app-to-trade-card-link'>
                            {localize('Try demo')}
                        </Link>
                        <Button type='button' text={localize('Get')} primary />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

type AppToTradeCardProps = {
    icon: string;
    sub_title: string;
    title: string;
};

export default observer(AppToTradeCard);
