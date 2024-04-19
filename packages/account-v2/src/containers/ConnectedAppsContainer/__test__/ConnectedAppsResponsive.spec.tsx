import React from 'react';
import { render, screen } from '@testing-library/react';
import { getFormattedAppScopes } from '../../../utils/connectedAppsUtils';
import { ConnectedAppsResponsive } from '../ConnectedAppsResponsive';
import userEvent from '@testing-library/user-event';

describe('ConnectedAppsResponsive', () => {
    it("should render the 'ConnectedAppsResponsive' component properly", async () => {
        const mockHandleToggleModal = jest.fn();
        const mockProps: React.ComponentProps<typeof ConnectedAppsResponsive> = {
            connectedApps: [
                {
                    app_id: 99,
                    app_markup_percentage: 1,
                    appstore: null,
                    github: null,
                    googleplay: null,
                    homepage: null,
                    last_used: '2021-10-31 06:49:52',
                    name: 'NAME',
                    official: 0,
                    redirect_uri: '',
                    scopes: ['read', 'admin'],
                    verification_uri: null,
                },
            ],
            handleToggleModal: mockHandleToggleModal,
        };
        const mockPermissions = getFormattedAppScopes(mockProps.connectedApps[0]?.scopes);
        render(<ConnectedAppsResponsive {...mockProps} />);

        const appName = mockProps.connectedApps[0].name;
        const lastName = mockProps.connectedApps[0].last_used;

        expect(screen.getByText(appName)).toBeInTheDocument();
        if (lastName) expect(screen.getByText(lastName)).toBeInTheDocument();
        if (mockPermissions) expect(screen.getByText(mockPermissions)).toBeInTheDocument();

        const button = screen.getByRole('button', { name: /Revoke access/i });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        expect(mockProps.handleToggleModal).toHaveBeenCalled();
    });
});
