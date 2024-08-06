import React, { useState, useEffect, forwardRef, Ref } from 'react';
import { Tag, Text, useSnackbar } from '@deriv-com/quill-ui';
import { StandaloneStarFillIcon, StandaloneStarRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { ActiveSymbols } from '@deriv/api-types';
import clsx from 'clsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useModulesStore } from 'Stores/useModulesStores';

type TMarketCategoryItem = {
    item: ActiveSymbols[0];
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
};

const MarketCategoryItem = forwardRef(
    ({ item, selectedSymbol, setSelectedSymbol, setIsOpen }: TMarketCategoryItem, ref: Ref<HTMLDivElement>) => {
        const [isFavorite, setIsFavorite] = useState(false);
        const { onChange: onSymbolChange } = useTraderStore();
        const { markets } = useModulesStore();
        const { favoriteSymbols, setFavoriteSymbols, removeFavoriteSymbol } = markets;
        const { addSnackbar } = useSnackbar();
        const { ui } = useStore();
        const { is_dark_mode_on } = ui;

        useEffect(() => {
            setIsFavorite(favoriteSymbols.includes(item.symbol));
        }, [favoriteSymbols, item.symbol]);

        const handleSelect = async (e: React.MouseEvent<HTMLSpanElement>) => {
            const symbol = (e.currentTarget as HTMLSpanElement).getAttribute('data-symbol');
            setSelectedSymbol(symbol ?? '');
            await onSymbolChange({ target: { name: 'symbol', value: symbol } });
            setIsOpen(false);
        };

        const toggleFavorites = (e: React.MouseEvent<HTMLSpanElement>) => {
            const symbol = (e.currentTarget as HTMLSpanElement).getAttribute('data-symbol');
            if (!symbol) return;
            const symbolIndex = favoriteSymbols.indexOf(symbol);

            if (symbolIndex !== -1) {
                removeFavoriteSymbol(symbol);
                addSnackbar({
                    icon: (
                        <StandaloneStarRegularIcon
                            fill={
                                !is_dark_mode_on
                                    ? 'var(--semantic-color-slate-solid-textIcon-inverse-highest)'
                                    : 'var(--semantic-color-monochrome-textIcon-normal-mid)'
                            }
                            iconSize='sm'
                        />
                    ),
                    message: <Localize i18n_default_text='Removed from favorites' />,
                    hasCloseButton: false,
                });
            } else {
                setFavoriteSymbols([...favoriteSymbols, symbol]);
                addSnackbar({
                    icon: <StandaloneStarFillIcon fill='var(--core-color-solid-mustard-700)' iconSize='sm' />,
                    message: <Localize i18n_default_text='Added to favorites' />,
                    hasCloseButton: false,
                });
            }
            setIsFavorite(favoriteSymbols.includes(symbol));
        };

        return (
            <div
                className={clsx('market-category-item', {
                    'market-category-item--selected': selectedSymbol === item.symbol,
                })}
                ref={ref}
            >
                <div className='market-category-item-left' data-symbol={item.symbol} onClick={handleSelect}>
                    <SymbolIconsMapper symbol={item.symbol} />
                    <Text
                        size='sm'
                        className={clsx('market-category-item-symbol', {
                            'market-category-item-symbol--selected': selectedSymbol === item.symbol,
                        })}
                    >
                        <span>{item.display_name}</span>
                    </Text>
                    {!item.exchange_is_open && (
                        <Tag
                            label={<Localize key='exchange-closed' i18n_default_text='CLOSED' />}
                            color='error'
                            variant={selectedSymbol === item.symbol ? 'outline' : 'fill'}
                            showIcon={false}
                        />
                    )}
                </div>
                <div onClick={toggleFavorites} data-symbol={item.symbol}>
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
                </div>
            </div>
        );
    }
);

MarketCategoryItem.displayName = 'MarketCategoryItem';

export default observer(MarketCategoryItem);
