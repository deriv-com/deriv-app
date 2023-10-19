import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ConnectedAppsInfo from '../connected-apps-info';

describe('<ConnectedAppsInfo />', () => {
    beforeEach(() => {
        render(
            <StoreProvider store={mockStore({})}>
                <ConnectedAppsInfo />
            </StoreProvider>
        );
    });

    it('should have h4 element with text "What are connected apps"', () => {
        const heading = screen.getByRole('heading', { name: 'What are connected apps?' });
        expect(heading).toBeInTheDocument();
    });

    it('should have an ordered list', () => {
        const orderedlist = screen.getByRole('list');
        expect(orderedlist).toBeInTheDocument();
    });

    it('should have three list items', () => {
        const listitems = screen.getAllByRole('listitem');
        expect(listitems).toHaveLength(3);
    });

    it('displays connected apps information', () => {
        expect(
            screen.getByText(
                'Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'As a user, you are responsible for sharing access and for actions that occur in your account (even if they were initiated by a third-party app on your behalf).'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please note that only third-party apps will be displayed on this page. Official Deriv apps will not appear here.'
            )
        ).toBeInTheDocument();
    });
});
