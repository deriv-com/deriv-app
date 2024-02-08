import React from 'react';
import { Tab, Tabs } from '@deriv-com/ui';
import './BuySellHeader.scss';

type TBuySellHeaderProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const BuySellHeader = ({ activeTab, setActiveTab }: TBuySellHeaderProps) => {
    return (
        <div className='p2p-v2-buy-sell-header' data-testid='dt_p2p_v2_buy_sell_header'>
            <Tabs
                TitleFontSize='sm'
                activeTab={activeTab}
                onChange={(index: number) => setActiveTab(index === 0 ? 'Buy' : 'Sell')}
                variant='primary'
                wrapperClassName='p2p-v2-buy-sell-header__tabs'
            >
                <Tab title='Buy' />
                <Tab title='Sell' />
            </Tabs>
        </div>
    );
};

export default BuySellHeader;
