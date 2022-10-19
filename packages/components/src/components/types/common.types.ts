import React from 'react';

export type TGenericObjectType = {
    [key: string]: React.ReactNode;
};

export type TCheckboxEvent = ReturnType<() => { target: { value: boolean } }>;
