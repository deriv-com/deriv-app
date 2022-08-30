import React from 'react';
import { Text } from '@deriv/components';
import { isMobile, formatDate } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';
import ApiTokenDeleteButton from './api-token-delete-button.jsx';
import ApiTokenTableBodyRow from './api-token-table-row.jsx';
import ApiTokenTableRowHeader from './api-token-table-row-header.jsx';
import ApiTokenTableRowScopesCell from './api-token-table-row-scopes-cell.jsx';
import ApiTokenTableRowTokenCell from './api-token-table-row-token-cell.jsx';

const ApiTokenTable = () => {
    const { api_tokens } = React.useContext(ApiTokenContext);

    const formatTokenScopes = str => {
        const string = str || '';
        const replace_filter = string.replace(/-|_/g, ' ');
        const sentenced_case = replace_filter[0].toUpperCase() + replace_filter.slice(1).toLowerCase();
        return sentenced_case;
    };

    const getTranslatedScopes = str => {
        switch (str) {
            case 'read':
                return localize('Read');
            case 'trade':
                return localize('Trade');
            case 'payments':
                return localize('Payments');
            case 'admin':
                return localize('Admin');
            case 'trading_information':
                return localize('Trading information');
            default:
                return formatTokenScopes(str);
        }
    };

    const getScopeValue = token => {
        const titled_scopes = token.scopes.map(scope => getTranslatedScopes(scope));
        const date_format = token.last_used ? formatDate(token.last_used, 'DD/MM/YYYY') : localize('Never');

        return {
            display_name: token.display_name,
            scopes: titled_scopes,
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
                            <ApiTokenTableRowTokenCell token={token.token} scopes={token.scopes} />
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
                                <Localize i18n_default_text='Scopes' />
                            </Text>
                            <ApiTokenTableRowScopesCell scopes={token.scopes} />
                        </div>
                        <div>
                            <ApiTokenDeleteButton token={token} />
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
                    <th />
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
