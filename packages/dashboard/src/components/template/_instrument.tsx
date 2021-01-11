import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Pair } from './elements';

const Instrument: React.FC<TInstrumentProps> = ({ title, pair_data }) => {
    return (
        <div className='dw-template__instrument'>
            <Text size='m' weight='bold' styles={{ lineHeight: '36px' }}>
                {title}
            </Text>
            <div className='dw-template__instrument-container'>
                {pair_data.map((item, idx) => (
                    <div key={idx}>
                        <Text size='sm' weight='bold'>
                            {item.title}
                        </Text>
                        <div className='dw-template__instrument-pair-wrapper'>
                            {item.data.map((pair, id) => (
                                <div key={id}>
                                    <Pair icon={pair.icon} description={pair.description} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='dw-template__line' />
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
type TInstrumentProps = {
    title: string;
    pair_data: Array<TPairDataItem>;
};
export default observer(Instrument);
