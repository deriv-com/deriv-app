import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import Button from 'Components/elements/button'

const GetSection: React.FC = () => {
    return (
        <section className='dw-get'>
            <Icon className='dw-get__icon' icon='IcMt5SyntheticDashboard' width='136' height='136' />
            <div className='dw-get__header'>
                <div className='dw-get__header--left'>
                    <Text size='l' weight='bold'>{localize("DMT5 Synthetic")}</Text>
                    <Text>{localize("Trade CFDs on synthetic indices that simulate real-world market movements.")}</Text>
                </div>
                <div className='dw-get__header--right'>
                    <Button large tertiary>{localize('Try demo')}</Button>
                    <Button large className='dw-get__header-center' primary>{localize('Get')}</Button>
                    <Icon icon='IcGetPlatform' width='40' height='40' />
                </div>
            </div>
          
        </section>
    );
};

export default GetSection;
