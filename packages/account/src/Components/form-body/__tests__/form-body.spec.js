import React from 'react';
import { render, screen } from '@testing-library/react';
import { isMobile, isDesktop } from '@deriv/shared';
import { FormBody } from '../form-body';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

describe('<FormBody />', () => {
    it('should render FormBody component with children in desktop', () => {
        const { container } = render(
            <FormBody scroll_offset='100px'>
                <div>Test children</div>
            </FormBody>
        );
        expect(container.querySelector('account__scrollbars_container--grid-layout')).toBeInTheDocument;
        expect(screen.getByText('Test children')).toBeInTheDocument();
    });

    it('should render FormBody component with children in mobile', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const { container } = render(
            <FormBody>
                <div>Test children</div>
            </FormBody>
        );
        expect(container.firstChild).toHaveClass('account__scrollbars_container--grid-layout');
        expect(screen.getByText('Test children')).toBeInTheDocument();
    });
});
