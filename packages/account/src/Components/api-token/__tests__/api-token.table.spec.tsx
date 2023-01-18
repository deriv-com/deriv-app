import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ApiTokenTable from '../api-token-table';
import ApiTokenProvider from '../api-token.provider';
import makeMockSocket from '../__mocks__/socket.mock';

const { wsClean, wsConnect, wsClient, wsServer } = makeMockSocket();

const tokens = {
    api_token: {
        tokens: [
            {
                display_name: 'Token example',
                last_used: '',
                scopes: ['admin', 'read', 'trade'],
                token: 'funny_token_string',
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

describe('Use API Token', () => {
    beforeEach(async () => {
        await wsConnect();
    });

    afterEach(() => {
        wsClean();
    });

    it('should render tokens table properly', async () => {
        render(<ApiTokenTable is_switching={false} />, {
            wrapper: ({ children }) => <ApiTokenProvider ws={wsClient}>{children}</ApiTokenProvider>,
        });

        // send the mocked tokens
        wsServer.send(tokens);

        const table_body = screen.getByTestId('api-token-table-body');

        const within_table_body = within(table_body);

        const table_rows = await within_table_body.findAllByRole('row');
        expect(table_rows.length).toBe(1);

        const token_name_cell = await within_table_body.findByRole('cell', { name: /Token example/i });
        expect(token_name_cell).toBeInTheDocument();

        const token_scopes_cell = await within_table_body.findByTestId('cell-scopes');

        expect(token_scopes_cell.childElementCount).toBe(1);

        const token_scopes_names = token_scopes_cell.textContent;

        const response_token_scopes = tokens.api_token.tokens[0].scopes;

        response_token_scopes.forEach(scope => {
            expect(token_scopes_names?.toLowerCase()).toContain(scope);
        });
    });
});
