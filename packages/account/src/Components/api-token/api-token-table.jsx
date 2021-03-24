import * as React from 'react';
import { Clipboard, Text } from '@deriv/components';
import { isMobile, formatDate } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';
import ApiTokenTableBodyRow from './api-token-table-row.jsx';
import ApiTokenTableRowHeader from './api-token-table-row-header.jsx';
import ApiTokenDeleteButtons from './api-token-delete-buttons.jsx';

const ApiTokenTable = () => {
    const { api_tokens } = React.useContext(ApiTokenContext);

    const formatTokenScopes = str => {
        const string = str || '';
        const replace_filter = string.replace(/-|_/g, ' ');
        const sentenced_case = replace_filter[0].toUpperCase() + replace_filter.slice(1).toLowerCase();
        return sentenced_case;
    };

    const getScopeValue = token => {
        const titled_scopes = token.scopes.map(scope => formatTokenScopes(scope));
        const mapped_scopes = titled_scopes.length === 5 ? localize('All') : titled_scopes.join(', ');
        const date_format = token.last_used ? formatDate(token.last_used, 'DD/MM/YYYY') : localize('Never');

        return {
            display_name: token.display_name,
            scopes: mapped_scopes,
            last_used: date_format,
            token: token.token,
        };
    };

    if (isMobile()) {
        return api_tokens.map(token_data => {
            const token = getScopeValue(token_data);

            return (
                <div key={token.token} className='da-api-token__scope'>
                    <div className='da-api-token__scope-item'>
                        <div>
                            <Text as='h5' size='xxs' color='general' line_height='xs' weight='bold'>
                                <Localize i18n_default_text='Name' />
                            </Text>
                            <Text
                                className='da-api-token__scope-item--name'
                                as='p'
                                size='s'
                                color='general'
                                line_height='m'
                            >
                                {token.display_name}
                            </Text>
                        </div>
                    </div>
                    <div className='da-api-token__scope-item'>
                        <div>
                            <Text as='h5' size='xxs' color='general' line_height='xs' weight='bold'>
                                <Localize i18n_default_text='Token' />
                            </Text>
                            <div className='da-api-token__clipboard-wrapper'>
                                <Text size='xs' color='general' line_height='m'>
                                    {token.token}
                                </Text>
                                <Clipboard
                                    className='da-api-token__clipboard'
                                    popover_props={{ relative_render: false, zIndex: 9999 }}
                                    token={token.token}
                                />
                            </div>
                        </div>
                        <div>
                            <Text as='h5' size='xxs' color='general' line_height='xs' weight='bold'>
                                <Localize i18n_default_text='Last Used' />
                            </Text>
                            <Text as='p' size='s' color='general' line_height='m'>
                                {token.last_used}
                            </Text>
                        </div>
                    </div>
                    <div className='da-api-token__scope-item'>
                        <div>
                            <Text as='h5' size='xxs' color='general' line_height='xs' weight='bold'>
                                <Localize i18n_default_text='Scope' />
                            </Text>
                            <Text as='p' size='s' color='general' line_height='m'>
                                {token.scopes}
                            </Text>
                        </div>
                        <div>
                            <ApiTokenDeleteButtons token={token} />
                        </div>
                    </div>
                </div>
            );
        });
    }

    return (
        <table className='da-api-token__table'>
            <thead>
                <tr className='da-api-token__table-header-row'>
                    <ApiTokenTableRowHeader text={localize('Name')} />
                    <ApiTokenTableRowHeader text={localize('Token')} />
                    <ApiTokenTableRowHeader text={localize('Scopes')} />
                    <ApiTokenTableRowHeader text={localize('Last used')} />
                    <ApiTokenTableRowHeader text={localize('Action')} />
                </tr>
            </thead>
            <tbody>
                {api_tokens.map(api_token => (
                    <ApiTokenTableBodyRow key={api_token.token} token={getScopeValue(api_token)} />
                ))}
            </tbody>
        </table>
    );
};

export default ApiTokenTable;
