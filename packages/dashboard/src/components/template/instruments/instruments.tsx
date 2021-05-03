import * as React from 'react';
import { Text } from '@deriv/components';
import Pair from './pair';

const Instruments: React.FC<TInstrumentsProps> = ({ title, pair_data }) => {
    return (
        <div className='dw-instruments'>
            <Text size='m' weight='bold' styles={{ lineHeight: '36px' }}>
                {title}
            </Text>
            <div className='dw-instruments__container'>
                {pair_data.map((item, idx) => (
                    <div key={idx}>
                        <Text size='sm' weight='bold'>
                            {item.title}
                        </Text>
                        <div className='dw-instruments__pair-wrapper'>
                            {item.data.map((pair, id) => (
                                <div key={id}>
                                    <Pair icon={pair.icon} description={pair.description} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='dw-instruments__line' />
        </div>
    );
};

type TDataItem = {
    icon: string;
    description: string;
};
type TPairDataItem = {
    title: string;
    data: Array<TDataItem>;
};
type TInstrumentsProps = {
    title: string;
    pair_data: Array<TPairDataItem>;
};
export default Instruments;
