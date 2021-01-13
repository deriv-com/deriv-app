import * as React from 'react';
import { Text } from '@deriv/components';
import Indice from './indice';

const Indices: React.FC<TIndicesProps> = ({ indice_data }) => {
    return (
        <div className='dw-indices'>
            {indice_data.map((item, idx) => (
                <div key={idx} className='dw-indices__container'>
                    <Text size='sm' weight='bold'>
                        {item.title}
                    </Text>
                    <Text>{item.sub_title}</Text>
                    <div className='dw-indices__pair-wrapper'>
                        {item.data.map((pair, id) => (
                            <div key={id}>
                                <Indice icon={pair.icon} description={pair.description} />
                            </div>
                        ))}
                    </div>
                    {item.line && <div className='dw-indices__line' />}
                </div>
            ))}

            <div className='dw-indices__line' />
        </div>
    );
};

type TDataItem = {
    icon: string;
    description: string;
};
type TPairDataItem = {
    title: string;
    sub_title?: string;
    line?: boolean;
    data: Array<TDataItem>;
};
type TIndicesProps = {
    indice_data: Array<TPairDataItem>;
};
export default Indices;
