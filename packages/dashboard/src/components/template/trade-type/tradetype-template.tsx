import * as React from 'react';
import Banner from '../components/_banner';
import AppToTradeCard from '../components/_app-to-trade-card';

const TradetypeTemplate: React.FC = () => {
    return (
        <React.Fragment>
            <div className='tradetype-template'>
                <Banner type='Margin' title='Trade positions larger than your capital' />
                <AppToTradeCard
                    icon='IcMt5Synthetic'
                    title='DMT5 Synthetic'
                    sub_title='Trade CFDs on synthetic indices that simulate real-world market movements.'
                />
            </div>
        </React.Fragment>
    );
};

export default TradetypeTemplate;
