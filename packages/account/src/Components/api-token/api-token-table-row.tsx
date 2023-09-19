import React from 'react';
import ApiTokenDeleteButton from './api-token-delete-button';
import ApiTokenTableRowCell from './api-token-table-row-cell';
import ApiTokenTableRowScopesCell from './api-token-table-row-scopes-cell';
import ApiTokenTableRowTokenCell from './api-token-table-row-token-cell';
import { TToken } from 'Types';

type TApiTokenTableRow = {
    token: TToken;
};

const ApiTokenTableRow = ({ token }: TApiTokenTableRow) => (
    <tr className='da-api-token__table-cell-row'>
        <ApiTokenTableRowCell className='da-api-token__table-cell--name'>{token.display_name}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenTableRowTokenCell token={token.token} scopes={token.scopes} />
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenTableRowScopesCell scopes={token.scopes} />
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell>{token.last_used}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenDeleteButton token={token} />
        </ApiTokenTableRowCell>
    </tr>
);

export default ApiTokenTableRow;
