import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import Button from 'Components/elements/button';

const GetSection: React.FC = () => {
    return (
        <section className='dw-get dw-get__wrapper'>
            <Icon className='dw-get__icon' icon='IcMt5SyntheticDashboard' width='136' height='136' />
            <div className='dw-get__wrapper dw-get__full-width'>
                <div className='dw-get__wrapper dw-get__header'>
                    <div className='dw-get__wrapper dw-get__header--left'>
                        <Text size='l' weight='bold'>
                            {localize('DMT5 Synthetic')}
                        </Text>
                        <Text size='xs'>
                            {localize('Trade CFDs on synthetic indices that simulate real-world market movements.')}
                        </Text>
                    </div>
                    <div className='dw-get__wrapper dw-get__header--right'>
                        <Button large tertiary>
                            {localize('Try demo')}
                        </Button>
                        <Button large className='dw-get__header-center' primary>
                            {localize('Get')}
                        </Button>
                        <Icon className='dw-get__share' icon='IcGetPlatform' width='40' height='40' />
                    </div>
                </div>
                <hr className='dw-get__divider' />
                <div className='dw-get__wrapper dw-get__trade'>
                    <div className='dw-get__wrapper dw-get__item-wrapper'>
                        <Text className='dw-get__item-title' color='less-prominent' size='xxs'>{localize('Trade')}</Text>
                        <div className='dw-get__wrapper dw-get__item'>
                            <Icon className='dw-get__item-icon' icon='IcMt5MarginTrading' width='16' height='16' />
                            <Text size='xxxs'>{localize('Margin')}</Text>
                        </div>
                    </div>

                    <hr className='dw-get__divider dw-get__divider--vertical' />

                    <div className='dw-get__wrapper dw-get__item-wrapper'>
                        <Text className='dw-get__item-title' color='less-prominent' size='xxs'>{localize('Markets')}</Text>
                        <div className='dw-get__wrapper dw-get__item'>
                            <Icon className='dw-get__item-icon' icon='IcMt5SyntheticIndices' width='16' height='16' />
                            <Text size='xxxs'>{localize('Synthetic indices')}</Text>
                        </div>
                    </div>
                </div>

                <hr className='dw-get__divider' />
            </div>
        </section>
    );
};

export default GetSection;
