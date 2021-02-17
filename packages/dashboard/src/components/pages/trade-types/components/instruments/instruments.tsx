import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import SubInstrumentItem from './sub-instrument-item';

const Instruments: React.FC<TInstrumentsProps> = ({ data }) => {
    return (
        <div className='dw-instruments'>
            <Text size='m' as='h3' weight='bold' styles={{ lineHeight: '36px' }}>
                {data.title}
            </Text>
            <div className='dw-instruments__instruments-container'>
                {data.instrument_data.map((instrument, idx) => (
                    <div key={idx} className='dw-instruments__instrument'>
                        <div className='dw-instruments__instrument-title-wrapper'>
                            <Icon icon={instrument.icon} size={48} className='dw-instruments__instrument-icon' />
                            <Text size='sm' as='h4' weight='bold'>
                                {instrument.subtitle}
                            </Text>
                        </div>
                        <Text size='xs' as='p'>
                            {instrument.description}
                        </Text>
                        {instrument.sub_instrument_data.map(sub_instrument => (
                            <>
                                <div className='dw-instruments__sub-instrument-title'>
                                    <Text size='sm' as='h5' weight='bold'>
                                        {sub_instrument.title}
                                    </Text>
                                </div>
                                <div className='dw-instruments__sub-instrument-description'>
                                    <Text size='xs' as='p'>
                                        {sub_instrument.description}
                                    </Text>
                                </div>
                                <div className='dw-instruments__sub-instrument-items-container'>
                                    {sub_instrument.sub_instrument_item_data.map((item, id) => (
                                        <SubInstrumentItem icon={item.icon} description={item.description} key={id} />
                                    ))}
                                </div>
                            </>
                        ))}
                        <div className='dw-instruments__line' />
                    </div>
                ))}
            </div>
        </div>
    );
};

type TInstrumentsProps = {
    data: TData;
};
type TData = {
    title: string;
    instrument_data: Array<TInstrumentData>;
};
type TInstrumentData = {
    icon: string;
    subtitle: string;
    description: string;
    sub_instrument_data: Array<TSubInstrumentData>;
};
type TSubInstrumentData = {
    title: string;
    description: string;
    sub_instrument_item_data: Array<TSubInstrumentItemData>;
};
type TSubInstrumentItemData = {
    icon: string;
    description: string;
};
export default Instruments;
