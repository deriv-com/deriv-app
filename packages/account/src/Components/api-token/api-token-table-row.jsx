import PropTypes from 'prop-types';
import * as React from 'react';
import ApiTokenDeleteButtons from './api-token-delete-buttons.jsx';
import ApiTokenTableRowCell from './api-token-table-row-cell.jsx';
import ApiTokenTableRowScopesCell from './api-token-table-row-scopes-cell.jsx';
import ApiTokenTableRowTokenCell from './api-token-table-row-token-cell.jsx';

const ApiTokenTableRow = ({ token }) => (
    <tr className='da-api-token__table-cell-row'>
        <ApiTokenTableRowCell className='da-api-token__table-cell--name'>{token.display_name}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenTableRowTokenCell token={token.token} />
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenTableRowScopesCell scopes={token.scopes} />
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell>{token.last_used}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenDeleteButtons token={token} />
        </ApiTokenTableRowCell>
    </tr>
);

ApiTokenTableRow.propTypes = {
    token: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
        last_used: PropTypes.string.isRequired,
        scopes: PropTypes.array.isRequired,
        token: PropTypes.string.isRequired,
    }).isRequired,
};

export default ApiTokenTableRow;
