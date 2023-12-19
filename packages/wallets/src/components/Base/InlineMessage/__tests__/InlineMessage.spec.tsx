import React from 'react';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../../hooks/useDevice';
import InlineMessage from '../InlineMessage';

jest.mock('../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));

describe('InlineMessage', () => {
    const getInLineMessageEl = () => screen.getByTestId('dt_inline_message');
    const getInLineMessageIconEl = () => screen.getByTestId('dt_inline_message_icon');

    it('renders with correct size', () => {
        const { rerender } = render(<InlineMessage message='Test message' size='lg' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--lg');
        expect(getInLineMessageIconEl()).toHaveAttribute('height', '24');
        expect(getInLineMessageIconEl()).toHaveAttribute('width', '24');

        rerender(<InlineMessage message='Test message' size='md' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--md');
        expect(getInLineMessageIconEl()).toHaveAttribute('height', '16');
        expect(getInLineMessageIconEl()).toHaveAttribute('width', '16');

        rerender(<InlineMessage message='Test message' size='sm' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--sm');

        rerender(<InlineMessage message='Test message' size='xs' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--xs');
    });

    it('renders with correct size on mobile device ', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const { rerender } = render(<InlineMessage message='Test message' size='lg' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--lg');
        expect(getInLineMessageIconEl()).toHaveAttribute('height', '16');
        expect(getInLineMessageIconEl()).toHaveAttribute('width', '16');

        rerender(<InlineMessage message='Test message' size='md' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--md');
        expect(getInLineMessageIconEl()).toHaveAttribute('height', '16');
        expect(getInLineMessageIconEl()).toHaveAttribute('width', '16');

        rerender(<InlineMessage message='Test message' size='sm' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--sm');

        rerender(<InlineMessage message='Test message' size='xs' type='warning' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--xs');
    });

    it('renders with correct font size on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        const { rerender } = render(<InlineMessage size='lg'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 16px');

        rerender(<InlineMessage size='md'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 14px');

        rerender(<InlineMessage size='sm'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 12px');

        rerender(<InlineMessage size='xs'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 10px');
    });

    it('renders with correct font size on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const { rerender } = render(<InlineMessage size='lg'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 14px');

        rerender(<InlineMessage size='md'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 12px');

        rerender(<InlineMessage size='sm'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 10px');

        rerender(<InlineMessage size='xs'> Test message </InlineMessage>);
        expect(screen.getByText('Test message')).toHaveStyle('font-size: 8px');
    });

    it('renders the correct icon for each type', () => {
        const { rerender } = render(<InlineMessage message='Test message' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--warning');

        rerender(<InlineMessage message='Test message' type='error' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--error');

        rerender(<InlineMessage message='Test message' type='announcement' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--announcement');

        rerender(<InlineMessage message='Test message' type='information' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--information');
    });

    it('renders the correct variant', () => {
        render(<InlineMessage message='Test message' type='warning' variant='contained' />);
        expect(getInLineMessageEl()).toHaveClass('wallets-inline-message--contained');
    });

    it('renders the title if provided', () => {
        render(<InlineMessage title='Test title' type='warning' />);
        expect(screen.getByText('Test title')).toBeInTheDocument();
    });

    it('renders the message if provided', () => {
        render(<InlineMessage message='Test message' type='warning' />);
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders the children if provided', () => {
        render(
            <InlineMessage message='Test message' type='warning'>
                <span>Test child</span>
            </InlineMessage>
        );
        expect(screen.getByText('Test child')).toBeInTheDocument();
    });
});
