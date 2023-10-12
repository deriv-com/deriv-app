import React from 'react';
import { render, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import MyProfileHeader from '../my-profile-header';

describe('<MyProfileHeader/>', () => {
    it('renders the MyProfileHeader component with all the tabs', () => {
        render(<MyProfileHeader />);

        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Ad details')).toBeInTheDocument();
        expect(screen.getByText('My counterparties')).toBeInTheDocument();
    });

    it('can switch between tabs when a tab is clicked on', () => {
        render(<MyProfileHeader />);

        const StatsTab = screen.getByRole('button', { name: 'Stats' });
        const MyCounterpartiesTab = screen.getByRole('button', { name: 'My counterparties' });

        expect(StatsTab).toHaveClass('dc-button-menu__button--active');

        UserEvent.click(MyCounterpartiesTab);

        expect(StatsTab).not.toHaveClass('dc-button-menu__button--active');
        expect(MyCounterpartiesTab).toHaveClass('dc-button-menu__button--active');
    });
});
