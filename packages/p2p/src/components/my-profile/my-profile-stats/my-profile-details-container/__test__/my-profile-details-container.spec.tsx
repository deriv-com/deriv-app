import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import MyProfileDetailsContainer from '../my-profile-details-container';

describe('<MyProfileDetailsContainer />', () => {
    it('should render MyProfileDetailsContainer component', () => {
        render(<MyProfileDetailsContainer />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Joined today')).toBeInTheDocument();
        expect(screen.getByText('Not rated yet')).toBeInTheDocument();
    });
});
