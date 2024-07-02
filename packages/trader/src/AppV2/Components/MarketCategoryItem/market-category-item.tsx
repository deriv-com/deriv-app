import React, { useState, useEffect } from 'react';
import { Tag, Text } from '@deriv-com/quill-ui';
import { StandaloneStarFillIcon, StandaloneStarRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { ActiveSymbols } from '@deriv/api-types';
import clsx from 'clsx';

type TMarketCategoryItem = {
    item: ActiveSymbols[0];
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
};

const MarketCategoryItem = ({ item, selectedSymbol, setSelectedSymbol, setIsOpen }: TMarketCategoryItem) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favoritesJson = localStorage.getItem('cq-favorites');

        if (favoritesJson) {
            const favorites = JSON.parse(favoritesJson);
            const chartFavorites = favorites['chartTitle&Comparison'];

            if (chartFavorites && Array.isArray(chartFavorites)) {
                setIsFavorite(chartFavorites.includes(item.symbol));
            }
        } else {
            const initialFavorites = {
                indicators: [],
                'chartTitle&Comparison': [],
            };
            localStorage.setItem('cq-favorites', JSON.stringify(initialFavorites));
        }
    }, [item.symbol, setIsFavorite]);

    const handleSelect = (e: React.MouseEvent<HTMLSpanElement>) => {
        const symbol = (e.target as HTMLSpanElement).getAttribute('data-symbol');
        setSelectedSymbol(symbol ?? '');
        setIsOpen(false);
    };

    const toggleFavorites = (e: React.MouseEvent<HTMLSpanElement>) => {
        const symbol = (e.currentTarget as HTMLSpanElement).getAttribute('data-symbol');
        if (!symbol) return;

        const chartFavorites = localStorage.getItem('cq-favorites');
        let favorites;

        if (!chartFavorites) {
            favorites = { indicators: [], 'chartTitle&Comparison': [symbol] };
            localStorage.setItem('cq-favorites', JSON.stringify(favorites));
            return;
        }

        favorites = JSON.parse(chartFavorites);
        const { 'chartTitle&Comparison': currentFavorites } = favorites;

        const symbolIndex = currentFavorites.indexOf(symbol);

        if (symbolIndex !== -1) {
            favorites['chartTitle&Comparison'] = currentFavorites.filter((favSymbol: string) => favSymbol !== symbol);
        } else {
            favorites['chartTitle&Comparison'] = [...currentFavorites, symbol];
        }
        setIsFavorite(!isFavorite);
        localStorage.setItem('cq-favorites', JSON.stringify(favorites));
    };

    return (
        <div
            className={clsx('market-category-item', {
                'market-category-item--selected': selectedSymbol === item.symbol,
            })}
        >
            <SymbolIconsMapper symbol={item.symbol} />
            <Text
                size='sm'
                className={clsx('market-category-item-symbol', {
                    'market-category-item-symbol--selected': selectedSymbol === item.symbol,
                })}
            >
                <span onClick={handleSelect} data-symbol={item.symbol}>
                    {item.display_name}
                </span>
            </Text>
            {!item.exchange_is_open && (
                <Tag
                    label={<Localize i18n_default_text='CLOSED' />}
                    color='error'
                    variant={selectedSymbol === item.symbol ? 'outline' : 'fill'}
                    showIcon={false}
                />
            )}
            <span onClick={toggleFavorites} data-symbol={item.symbol}>
                {isFavorite ? (
                    <StandaloneStarFillIcon fill='var(--core-color-solid-mustard-700)' iconSize='sm' />
                ) : (
                    <StandaloneStarRegularIcon
                        fill={
                            selectedSymbol === item.symbol
                                ? 'var(--semantic-color-slate-solid-textIcon-inverse-highest)'
                                : 'var(--semantic-color-monochrome-textIcon-normal-mid)'
                        }
                        iconSize='sm'
                    />
                )}
            </span>
        </div>
    );
};

export default MarketCategoryItem;
