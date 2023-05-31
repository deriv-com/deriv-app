import React from 'react';
import { screen, render } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import BlockUserEmpty from '..';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
}));

describe('BlockUserEmpty', () => {
    it('should render <BlockUserEmpty/> component for desktop version', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(true);
        render(<BlockUserEmpty />);
        expect(screen.getByTestId('dt_desktop_content')).toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
    it('should render <BlockUserEmpty /> component for mobile version', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<BlockUserEmpty />);
        expect(screen.queryByTestId('dt_desktop_content')).not.toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
});
