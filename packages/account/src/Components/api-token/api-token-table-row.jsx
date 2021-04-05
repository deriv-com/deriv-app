import PropTypes from 'prop-types';
import * as React from 'react';
import { Clipboard, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import ApiTokenDeleteButtons from './api-token-delete-buttons.jsx';
import ApiTokenTableRowCell from './api-token-table-row-cell.jsx';

const ApiTokenTableRow = ({ token }) => (
    <tr className='da-api-token__table-cell-row'>
        <ApiTokenTableRowCell className='da-api-token__table-cell--name'>{token.display_name}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <div className='da-api-token__clipboard-wrapper'>
                <Text as='p' color='prominent ' size='xs' line_height='m'>
                    {token.token}
                </Text>
                <Clipboard
                    className='da-api-token__clipboard'
                    info_message={localize('Click here to copy token')}
                    popover_props={{ relative_render: false, zIndex: 9999 }}
                    success_message={localize('Token copied!')}
                    text_copy={token.token}
                />
            </div>
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell>{token.scopes}</ApiTokenTableRowCell>
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
        scopes: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
    }).isRequired,
};

export default ApiTokenTableRow;
