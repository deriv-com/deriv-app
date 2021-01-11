import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Indice } from './elements';

const Indices: React.FC<TIndicesProps> = ({ indice_data }) => {
    return (
        <div className='dw-template__indices'>
            <div>
                {indice_data.map((item, idx) => (
                    <div key={idx} className='dw-template__indices-container'>
                        <Text size='sm' weight='bold'>
                            {item.title}
                        </Text>
                        <Text>{item.sub_title}</Text>
                        <div className='dw-template__indices-pair-wrapper'>
                            {item.data.map((pair, id) => (
                                <div key={id}>
                                    <Indice icon={pair.icon} description={pair.description} />
                                </div>
                            ))}
                        </div>
                        {item.line && <div className='dw-template__line' />}
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
    sub_title?: string;
    line?: boolean;
    data: Array<TDataItem>;
};
type TIndicesProps = {
    indice_data: Array<TPairDataItem>;
};
export default observer(Indices);
