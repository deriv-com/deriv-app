import React from 'react';
import { routes } from '@deriv/shared';
import { BinaryLink } from '../../Routes';

const EndpointNote = () => {
    const server_url = localStorage.getItem('config.server_url');
    return server_url ? (
        <span style={{ fontSize: 'var(--text-size-xs)', color: 'var(--brand-red-coral)' }}>
            The server{' '}
            <BinaryLink className='account-settings-toggle' to={routes.endpoint}>
                endpoint
            </BinaryLink>{' '}
            is: {server_url}
        </span>
    ) : null;
};

export { EndpointNote };
