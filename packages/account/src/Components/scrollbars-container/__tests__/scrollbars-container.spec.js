import React from 'react';
import { render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { ScrollbarsContainer } from '../scrollbars-container';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('<ScrollbarsContainer />', () => {
    it('should render children with ScrollbarsContainer component for desktop without scroll_offset for desktop ', () => {
        const { container } = render(
            <ScrollbarsContainer>
                <div>Test children</div>
            </ScrollbarsContainer>
        );

        expect(container.firstChild).not.toHaveClass('account__scrollbars_container');
        expect(container.firstChild.style.maxHeight).toBe('100%');

        const child_div_el = screen.getByText('Test children');
        expect(child_div_el).toBeInTheDocument();
        expect(child_div_el.parentElement).toHaveClass('account__scrollbars_container');
    });
    it('should render children with ScrollbarsContainer component for desktop with scroll_offset and extra className for desktop ', () => {
        const { container } = render(
            <ScrollbarsContainer scroll_offset='33%' className='test__class-name'>
                <div>Test children</div>
            </ScrollbarsContainer>
        );

        expect(container.firstChild.style.maxHeight).toBe('calc(100% - 33%)');

        const child_div_el = screen.getByText('Test children');
        expect(child_div_el).toBeInTheDocument();
        expect(child_div_el.parentElement).toHaveClass('account__scrollbars_container test__class-name');
    });
    it('should render children with ScrollbarsContainer component with scroll_offset and extra className for mobile', () => {
        isMobile.mockReturnValue(true);

        const { container } = render(
            <ScrollbarsContainer scroll_offset='33%' className='test__class-name'>
                <div>Test children</div>
            </ScrollbarsContainer>
        );
        expect(container.firstChild).toHaveClass('account__scrollbars_container');
        expect(container.firstChild.style.maxHeight).not.toBe('calc(100% - 33%)');

        const child_div_el = screen.getByText('Test children');
        expect(child_div_el).toBeInTheDocument();
        expect(child_div_el.parentElement).toHaveClass('account__scrollbars_container test__class-name');
    });
});
