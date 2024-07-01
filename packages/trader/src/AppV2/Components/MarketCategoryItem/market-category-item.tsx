import React from 'react';
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
    const favorite = false;
    const handleSelect = (e: React.MouseEvent<HTMLSpanElement>) => {
        const symbol = (e.target as HTMLSpanElement).getAttribute('data-symbol');
        setSelectedSymbol(symbol ?? '');
        setIsOpen(false);
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
                />
            )}
            {favorite ? (
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
        </div>
    );
};

export default MarketCategoryItem;
