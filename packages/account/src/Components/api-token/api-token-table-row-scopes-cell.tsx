import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

type TApiTokenTableRowScopesCell = {
    children?: never;
    scopes: string[];
};

const ApiTokenTableRowScopesCell = ({ scopes }: TApiTokenTableRowScopesCell) => {
    return (
        <div className='da-api-token__table-scopes-cell-block'>
            {scopes.map(scope => (
                <div
                    key={scope}
                    className={classNames('da-api-token__table-scope-cell', {
                        'da-api-token__table-scope-cell-admin': scope.toLowerCase() === 'admin',
                    })}
                >
                    {scope}
                </div>
            ))}
        </div>
    );
};

export default ApiTokenTableRowScopesCell;
