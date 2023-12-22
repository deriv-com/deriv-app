import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';
import RiskToleranceWarningModal from '../risk-tolerance-warning-modal';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(),
}));

describe('<RiskToleranceWarningModal/>', () => {
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
            handleAcceptRisk: jest.fn(),
            title: 'Trading Experience Assessment',
            button_text: 'OK',
            body_content: <div>body_content</div>,
            has_sub_header: true,
        };
        render(<RiskToleranceWarningModal {...props} />);

        const text = screen.getByText('Trading Experience Assessment');

        expect(text).toBeInTheDocument();
    });

    it('should render modal correctly on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        const props = {
            show_risk_modal: true,
            handleAcceptRisk: jest.fn(),
            title: 'Trading Experience Assessment',
            button_text: 'OK',
            body_content: <div>body_content</div>,
            has_sub_header: false,
        };
        render(<RiskToleranceWarningModal {...props} />);
        const text = screen.getByText('Trading Experience Assessment');

        expect(text).toBeInTheDocument();
    });

    it('should show trigger handleAcceptRisk when click on button', () => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        const props = {
            show_risk_modal: true,
            handleAcceptRisk: jest.fn(),
            title: 'Trading Experience Assessment',
            button_text: 'OK',
            body_content: <div>body_content</div>,
            has_sub_header: false,
        };
        render(<RiskToleranceWarningModal {...props} />);

        const button = screen.getByText('OK');

        userEvent.click(button);

        expect(props.handleAcceptRisk).toBeCalledTimes(1);
    });
});
