import React from 'react';
import { render, screen } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import TestWarningModal from '../test-warning-modal';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(),
}));

describe('<TestWarningModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render modal correctly on desktop', () => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        const props = {
            show_risk_modal: true,
            title: 'Appropriateness Test Warning',
            body_content: <div>body_content</div>,
            footer_content: <div>footer_content</div>,
        };
        render(<TestWarningModal {...props} />);

        const text = screen.getByText('Appropriateness Test Warning');

        expect(text).toBeInTheDocument();
    });

    it('should render modal correctly on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        const props = {
            show_risk_modal: true,
            title: 'Appropriateness Test Warning',
            body_content: <div>body_content</div>,
            footer_content: <div>footer_content</div>,
        };
        render(<TestWarningModal {...props} />);
        const text = screen.getByText('Appropriateness Test Warning');

        expect(text).toBeInTheDocument();
    });
});
