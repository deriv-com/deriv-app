import advertiserPaymentMethodsReducer from '../advertiserPaymentMethodsReducer';

const mockInitialState: Parameters<typeof advertiserPaymentMethodsReducer>[0] = {
    isVisible: false,
    title: '',
};
const mockPaymentMethod: Parameters<typeof advertiserPaymentMethodsReducer>[0]['selectedPaymentMethod'] = {
    display_name: 'Bank Transfer',
    fields: {
        account: {
            display_name: 'Account Number',
            required: 1,
            type: 'text',
            value: '00112233445566778899',
        },
        bank_name: {
            display_name: 'Bank Transfer',
            required: 1,
            type: 'text',
            value: 'Bank Name',
        },
    },
    id: 'bank_transfer',
    method: 'bank_transfer',
};
describe('advertiserPaymentMethodsReducer', () => {
    it('should return the correct object when the action type is add and a selected payment method is provided', () => {
        const action: Parameters<typeof advertiserPaymentMethodsReducer>[1] = {
            payload: {
                ...mockInitialState,
                selectedPaymentMethod: { ...mockPaymentMethod, displayName: mockPaymentMethod.display_name },
            },
            type: 'ADD',
        };
        expect(advertiserPaymentMethodsReducer(mockInitialState, action)).toEqual({
            actionType: 'ADD',
            isVisible: true,
            selectedPaymentMethod: mockPaymentMethod,
            title: 'Add payment method',
        });
    });
    it('should return the correct object when the action type is add and a selected payment method is not provided', () => {
        const action: Parameters<typeof advertiserPaymentMethodsReducer>[1] = {
            payload: {},
            type: 'ADD',
        };
        expect(advertiserPaymentMethodsReducer(mockInitialState, action)).toEqual({
            actionType: 'ADD',
            isVisible: true,
            title: 'Add payment method',
        });
    });
    it('should return the correct object when the action type is edit', () => {
        const action: Parameters<typeof advertiserPaymentMethodsReducer>[1] = {
            payload: {
                ...mockInitialState,
                selectedPaymentMethod: { ...mockPaymentMethod, displayName: 'Bank Transfer 1' },
            },
            type: 'EDIT',
        };
        expect(advertiserPaymentMethodsReducer(mockInitialState, action)).toEqual({
            actionType: 'EDIT',
            isVisible: true,
            selectedPaymentMethod: { ...mockPaymentMethod, display_name: 'Bank Transfer 1' },
            title: 'Edit payment method',
        });
    });
    it('should return the correct object when the action type is delete', () => {
        const action: Parameters<typeof advertiserPaymentMethodsReducer>[1] = {
            payload: {
                ...mockInitialState,
                selectedPaymentMethod: mockPaymentMethod,
            },
            type: 'DELETE',
        };
        expect(advertiserPaymentMethodsReducer(mockInitialState, action)).toEqual({
            actionType: 'DELETE',
            selectedPaymentMethod: mockPaymentMethod,
        });
    });
    it('should return an empty object when the type is reset', () => {
        const action: Parameters<typeof advertiserPaymentMethodsReducer>[1] = {
            type: 'RESET',
        };
        expect(advertiserPaymentMethodsReducer(mockInitialState, action)).toEqual({});
    });
});
