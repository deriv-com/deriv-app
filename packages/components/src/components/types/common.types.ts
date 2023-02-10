import React from 'react';

export type TGenericObjectType = {
    [key: string]: React.ReactNode;
};

export type TItem = {
    id: string;
    value: Array<TItem> | string;
};
