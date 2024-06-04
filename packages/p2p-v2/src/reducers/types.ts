import { TAdvertiserPaymentMethods, TSelectedPaymentMethod } from 'types';

export type TFormState = {
    actionType?: 'ADD' | 'DELETE' | 'EDIT' | 'RESET';
    isVisible?: boolean;
    selectedPaymentMethod?: DeepPartial<NonNullable<TAdvertiserPaymentMethods>[number]>;
    title?: string;
};

export type TReducerAction = {
    payload?: {
        formState?: TFormState;
        selectedPaymentMethod?: DeepPartial<TSelectedPaymentMethod>;
    };
    type: TFormState['actionType'];
};
