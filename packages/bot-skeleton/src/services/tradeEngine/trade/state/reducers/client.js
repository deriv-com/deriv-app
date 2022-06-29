const initialState = {
    balance: 0,
    currency: '',
};

const client = (state = initialState, action) => {
    switch (action.type) {
        case 'BALANCE':
            return {
                ...state,
                balance: action.payload.balance,
                currency: action.payload.currency,
            };
        default:
            return state;
    }
};

export default client;
