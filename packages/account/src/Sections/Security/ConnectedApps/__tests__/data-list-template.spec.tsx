import React from 'react';
import { render, screen } from '@testing-library/react';
import DataListTemplate from '../data-list-template';
import { getConnectedAppsScopes } from '../template-helper';

describe('DataListTemplate', () => {
    it("should render the 'DataListTemplate' component with correct details", () => {
        const mock_props: React.ComponentProps<typeof DataListTemplate> = {
            connected_apps: [
                {
                    app_id: 99,
                    app_markup_percentage: 1,
                    last_used: '2021-10-31 06:49:52',
                    name: 'NAME',
                    official: 0,
                    scopes: ['read', 'admin'],
                    appstore: null,
                    github: null,
                    googleplay: null,
                    homepage: null,
                    redirect_uri: '',
                    verification_uri: null,
                },
            ],
            handleToggleModal: () => undefined,
        };
        const mock_permissions = getConnectedAppsScopes(mock_props.connected_apps[0]?.scopes);
        render(<DataListTemplate {...mock_props} />);

        expect(screen.getByText(mock_props.connected_apps[0].name)).toBeInTheDocument();
        if (mock_props.connected_apps[0]?.last_used) {
            expect(screen.getByText(mock_props.connected_apps[0]?.last_used)).toBeInTheDocument();
        } else {
            expect(mock_props.connected_apps[0]?.last_used).not.toBeNull();
        }
        if (mock_permissions) {
            expect(screen.getByText(mock_permissions)).toBeInTheDocument();
        } else {
            expect(mock_permissions).not.toBeNull();
        }
    });
});
