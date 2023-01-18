export const mock_success_get_tokens = {
    api_token: {
        tokens: [
            {
                display_name: 'Token example',
                last_used: '',
                scopes: ['admin', 'read', 'trade'],
                token: 'token_string_whatever',
                valid_for_ip: '',
            },
        ],
    },
    echo_req: {
        api_token: 1,
        req_id: 2,
    },
    msg_type: 'api_token',
    req_id: 2,
};

export const mock_failed_get_tokens = {
    echo_req: {
        api_token: 1,
        req_id: 2,
    },
    error: {
        code: 'InputValidationFailed',
        details: {
            api_token: 'Not in enum list: 1.',
        },
        message: 'Input validation failed: api_token',
    },
    msg_type: 'api_token',
    req_id: 2,
};

export const mock_success_add_token = {
    api_token: {
        tokens: [
            {
                display_name: 'Token example',
                last_used: '',
                scopes: ['admin', 'read', 'trade'],
                token: 'token_string_whatever',
                valid_for_ip: '',
            },
            {
                display_name: 'new_token',
                last_used: '',
                scopes: ['payment', 'trading_information'],
                token: 'token_string_whatever',
                valid_for_ip: '',
            },
        ],
    },
    echo_req: {
        api_token: 1,
        new_token: 'new_token',
        new_token_scopes: ['payments', 'trading_information'],
        req_id: 2,
    },
    msg_type: 'api_token',
    req_id: 2,
};

export const mock_success_delete_token = {
    api_token: {
        delete_token: 1,
        tokens: [
            {
                display_name: 'test',
                last_used: '2023-01-16 19:23:25',
                scopes: ['read', 'trade', 'payments', 'trading_information', 'admin'],
                token: 'test_toket_after_delete',
                valid_for_ip: '',
            },
        ],
    },
    echo_req: { api_token: 1, delete_token: 'token_tobe_deleted_on_this_call', req_id: 2 },
    msg_type: 'api_token',
    req_id: 2,
};
