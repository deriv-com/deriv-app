import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailPasswordSection from '../email-password-section';

describe('EmailPasswordSection', () => {
    const mockProps = {
        title: 'Test Title',
        title_icon: 'test-icon',
        description: 'Test description',
        onClick: jest.fn(),
        button_text: 'Test Button',
    };

    it('should renders correctly with all props', () => {
        render(<EmailPasswordSection {...mockProps} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('should calls onClick when button is clicked', () => {
        render(<EmailPasswordSection {...mockProps} />);

        const button = screen.getByRole('button', { name: 'Test Button' });
        fireEvent.click(button);

        expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('should not render button when should_display_button is false', () => {
        render(<EmailPasswordSection {...mockProps} should_display_button={false} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render button with icon when provided', () => {
        const buttonIcon = <span data-testid='test-icon'>Icon</span>;
        render(<EmailPasswordSection {...mockProps} button_icon={buttonIcon} />);

        const button = screen.getByRole('button', { name: 'Icon Test Button' });
        expect(button).toContainElement(screen.getByTestId('test-icon'));
    });

    it('should render description as ReactNode when provided', () => {
        const customDescription = <span data-testid='custom-description'>Custom Description</span>;
        render(<EmailPasswordSection {...mockProps} description={customDescription} />);

        expect(screen.getByTestId('custom-description')).toBeInTheDocument();
    });
});
