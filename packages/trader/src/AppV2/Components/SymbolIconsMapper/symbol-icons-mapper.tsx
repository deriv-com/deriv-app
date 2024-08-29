import React from 'react';
import { marketIcons } from 'AppV2/Utils/market-icons';

type TSymbolIconsMapper = {
    symbol: string;
};

const SymbolIconsMapper = ({ symbol }: TSymbolIconsMapper) => {
    const iconSize = 'md';

    const IconComponent = marketIcons[symbol as keyof typeof marketIcons];
    return IconComponent ? <IconComponent iconSize={iconSize} /> : null;
};

export default SymbolIconsMapper;
