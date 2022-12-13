import React from 'react';
import { EmptyNotification } from '../empty-notification';
import { render, screen } from '@testing-library/react';

describe('EmptyNotification Component', () => {
    it('should render EmptyNotification component', () => {
        render(<EmptyNotification />);
        const text = screen.getByText(/No notifications/i);
        expect(text).toBeInTheDocument();
    });

    it('should render the "IcBell" Icon', () => {
        render(<EmptyNotification />);
        const icon = screen.getByTestId('ic-box-icon');
        expect(icon).toBeInTheDocument();
    });
});
