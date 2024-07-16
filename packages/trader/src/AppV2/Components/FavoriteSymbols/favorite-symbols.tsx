import React from 'react';
import MarketCategoryItem from '../MarketCategoryItem';
import { useGetFavoriteSymbols } from 'AppV2/Hooks/useGetFavoriteSymbols';
import NoFavoriteSymbol from './no-favorite-symbol';
import { observer } from '@deriv/stores';

type TFavoriteSymbols = {
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
};

const FavoriteSymbols = observer(({ selectedSymbol, setSelectedSymbol, setIsOpen }: TFavoriteSymbols) => {
    const favoriteSymbols = useGetFavoriteSymbols();

    return (
        <React.Fragment>
            {favoriteSymbols.length > 0 ? (
                <div className='favorite-symbols__container'>
                    {favoriteSymbols.map(symbol => (
                        <MarketCategoryItem
                            key={symbol?.display_name}
                            item={symbol}
                            selectedSymbol={selectedSymbol}
                            setSelectedSymbol={setSelectedSymbol}
                            setIsOpen={setIsOpen}
                        />
                    ))}
                </div>
            ) : (
                <NoFavoriteSymbol />
            )}
        </React.Fragment>
    );
});

export default FavoriteSymbols;
