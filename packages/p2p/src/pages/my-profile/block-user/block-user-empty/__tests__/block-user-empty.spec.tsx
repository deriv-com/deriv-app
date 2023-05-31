import React from 'react';
import { screen, render } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import BlockUserEmpty from '..';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/components', () => {
    const originalModule = jest.requireActual('@deriv/components');

    return {
        ...originalModule,
        MobileFullPageModal: jest.fn(() => (
            <div data-testid='dt_mocked_mobile_full_page_modal'>No one to show here</div>
        )),
    };
});

describe('BlockUserEmpty', () => {
    it('should render', () => {
        (isDesktop as jest.Mock).mockReturnValueOnce(true);
        render(<BlockUserEmpty />);
        expect(screen.getByTestId('dt_desktop_content')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_mocked_mobile_full_page_modal')).not.toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
    it('should render mobile version', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<BlockUserEmpty />);
        expect(screen.getByTestId('dt_mocked_mobile_full_page_modal')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_desktop_content')).not.toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
});
