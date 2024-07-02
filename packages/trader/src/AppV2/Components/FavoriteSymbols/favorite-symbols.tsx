import React from 'react';
import MarketCategoryItem from '../MarketCategoryItem';
import { useGetFavoriteSymbols } from 'AppV2/Hooks/useGetFavoriteSymbols';

type TFavoriteSymbols = {
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
};

const FavoriteSymbols = ({ selectedSymbol, setSelectedSymbol, setIsOpen }: TFavoriteSymbols) => {
    const favoriteSymbols = useGetFavoriteSymbols();

    return (
        <React.Fragment>
            {favoriteSymbols.length > 0 ? (
                favoriteSymbols.map(symbol => (
                    <MarketCategoryItem
                        key={symbol?.display_name}
                        item={symbol}
                        selectedSymbol={selectedSymbol}
                        setSelectedSymbol={setSelectedSymbol}
                        setIsOpen={setIsOpen}
                    />
                ))
            ) : (
                <div>empty</div>
            )}
        </React.Fragment>
    );
};

export default FavoriteSymbols;
