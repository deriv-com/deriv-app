import React from 'react';

export type TTradeDescription = {
    onClick: (term: string, e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
};

export type TTradeDescriptionWithFX = TTradeDescription & {
    is_vanilla_fx?: boolean;
    is_multiplier_fx?: boolean;
};
