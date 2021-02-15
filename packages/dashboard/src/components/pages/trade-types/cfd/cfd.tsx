import * as React from 'react';
import { localize } from '@deriv/translations';
import { Data, CardData, BannerData } from './data';
import Wrapper from '../components/wrapper';
import Banner from '../components/banner';
import AppToTrade from '../components/app-to-trade';
import Instruments from '../components/instruments';
import YouMightLike from '../components/you-might-like';

const CFD: React.FC = () => {
    return (
        <Wrapper>
            <Banner banner_items={BannerData} type={localize('CFDs')} />
            <AppToTrade
                title={localize('Apps to trade CFDs')}
                cards={CardData}
                benefit_description={localize(
                    'Trade with margin, and leverage your positions. With leverage, you can trade positions larger than your capital and maximise your returns when the market moves in your favour.'
                )}
            />
            <Instruments data={Data} />
            <YouMightLike trade_type='3' />
        </Wrapper>
    );
};

export default CFD;
