import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const Instruments: React.FC = () => {
    return (
        <div className="dw-instruments">
            <Text className="dw-instruments__title" size='m' weight='bold'>{localize('Markets and instruments to trade on DMT5 Synthetics')}</Text>
            <div className="dw-instruments__market">
                <Icon className="dw-instruments__market-icon" icon="IcMt5SyntheticIndices" width='48' height='48' />
                <div className='dw-instruments__market-title'>
                    <Text size='sm' weight='bold'>{localize('Synthetic indices')}</Text>
                    {/* <Text></Text> */}
                </div>
            </div>
            <div className="dw-instruments__submarket">
                <Text className="dw-instruments__submarket-title" size='sm' weight='bold'>{localize('Volatility indices')}</Text>
                <Text className='dw-instruments__submarket-subtitle'>{localize('These indices correspond to simulated markets with constant volatilities of 10%, 25%, 50%, 75%, and 100%. One tick is generated every two seconds for volatility indices 10, 25, 50, 75, and 100. One tick is generated every second for volatility indices 10 (1s), 25 (1s), 50 (1s), 75 (1s), and 100 (1s).')}</Text>
                <div className='dw-instruments__symbol'>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                    <div className='dw-instruments__symbol-item'>
                        <Icon className='dw-instruments__symbol-icon' icon='IcUnderlyingR_100' width='40' height='40' />
                        <Text size='xs'>{localize('Volatility 10 Index')}</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instruments;
