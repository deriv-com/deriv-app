import React from 'react';
import MarketCategoryItem from '../MarketCategoryItem';
import { useGetFavoriteSymbols } from 'AppV2/Hooks/useGetFavoriteSymbols';
import NoFavoriteSymbols from './no-favorite-symbols';
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
                <NoFavoriteSymbols />
            )}
        </React.Fragment>
    );
});

export default FavoriteSymbols;
