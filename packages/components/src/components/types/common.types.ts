import React from 'react';
import { getCardLabels } from '@deriv/shared';

export type TGenericObjectType = {
    [key: string]: React.ReactNode;
};
export type TGetCardLables = () => ReturnType<typeof getCardLabels>;
