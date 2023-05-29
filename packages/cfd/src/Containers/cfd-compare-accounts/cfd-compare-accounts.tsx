import React from 'react';
import { observer } from 'mobx-react';
import { Text, Icon, PageOverlay, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useHistory } from 'react-router-dom';
import InstumentsIconWithLabel from './instruments-icon-with-label';

interface CardData {
    id: number;
    title: string;
    description: string;
}

type TIconData = {
    icon:
        | 'DerivedFX'
        | 'Synthetics'
        | 'BasketIndices'
        | 'Stocks'
        | 'StockIndices'
        | 'Commodities'
        | 'Forex'
        | 'Cryptocurrencies'
        | 'ETF';
    text: string;
};

const cardData: CardData[] = [
    {
        id: 1,
        title: 'Card 1',
        description: 'This is the description for Card 1.',
    },
    {
        id: 2,
        title: 'Card 2',
        description: 'This is the description for Card 2.',
    },
    {
        id: 3,
        title: 'Card 3',
        description: 'This is the description for Card 3.',
    },
    {
        id: 4,
        title: 'Card 4',
        description: 'This is the description for Card 4.',
    },
    {
        id: 5,
        title: 'Card 5',
        description: 'This is the description for Card 5.',
    },
    {
        id: 6,
        title: 'Card 6',
        description: 'This is the description for Card 6.',
    },
    {
        id: 7,
        title: 'Card 7',
        description: 'This is the description for Card 7.',
    },
    // Add more card data as needed
    // ...
];

const CompareCFDs = () => {
    const history = useHistory();
    const iconData: TIconData[] = [
        { icon: 'Synthetics', text: 'Synthetics' },
        { icon: 'BasketIndices', text: 'Basket Indices' },
        { icon: 'DerivedFX', text: 'Derived FX' },
        { icon: 'Stocks', text: 'Stock' },
        { icon: 'StockIndices', text: 'Stock Indices' },
        { icon: 'Commodities', text: 'Commodities' },
        { icon: 'Forex', text: 'Forex' },
        { icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
        { icon: 'ETF', text: 'ETF' },
    ];

    const CompareAccounts: React.FC = () => {
        return (
            <div className={'compare-cfd-account-outline'}>
                {iconData.map(item => (
                    <InstumentsIconWithLabel
                        key={item.text}
                        icon={item.icon}
                        text={item.text}
                        highlighted={true}
                        // className={'compare-cfd-account-outline'}
                    />
                ))}
            </div>
        );
    };

    const DesktopHeader = (
        <div className='compare-cfd-header'>
            <div
                className='compare-cfd-header-navigation'
                onClick={() => {
                    history.push(routes.traders_hub);
                }}
            >
                <Icon icon='IcArrowLeftBold' />
                <Text size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text="Trader's hub" />
                </Text>
            </div>
            <h1 className='compare-cfd-header-title'>
                <Text size='m' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Compare all available accounts' />
                </Text>
            </h1>
        </div>
    );

    const CardList: React.FC = () => {
        return (
            <div className='card-list'>
                {cardData.map(item => (
                    <CompareAccounts key={item.id} />
                ))}
            </div>
        );
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <PageOverlay header={DesktopHeader} is_from_app={routes.traders_hub}>
                    Desktop wrapper
                </PageOverlay>
                <div className='compare-cfd-account-outline'>
                    <CardList />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    header={localize('Compare CFDs accounts')}
                    header_classname='compare-cfd-header-title'
                    is_from_app={!routes.traders_hub}
                    onClickClose={() => history.push(routes.traders_hub)}
                >
                    mobile wrapper
                </PageOverlay>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(CompareCFDs);
