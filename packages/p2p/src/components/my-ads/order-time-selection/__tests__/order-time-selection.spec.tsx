import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import OrderTimeSelection from '../order-time-selection';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

describe('<OrderTimeSelection/>', () => {
    beforeEach(() => {
        mockUseFormikContext.mockReturnValue({
            handleSubmit: jest.fn(),
            values: {},
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the OrderTimeSelection component', () => {
        render(<OrderTimeSelection />);

        expect(screen.getByText('Orders must be completed in')).toBeInTheDocument();
        expect(screen.getByTestId('dt_order_time_selection_info_icon')).toBeInTheDocument();
    });
    it('should show tooltip message on hovering info icon in desktop view', () => {
        render(<OrderTimeSelection />);
        const info_icon = screen.getByTestId('dt_order_time_selection_info_icon');
        userEvent.hover(info_icon);

        expect(screen.getByText('Orders will expire if they aren’t completed within this time.')).toBeInTheDocument();
    });
    it('should open orderTimeTooltipModal on clicking info icon in responsive view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<OrderTimeSelection />);

        const info_icon = screen.getByTestId('dt_order_time_selection_info_icon');

        userEvent.click(info_icon);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'OrderTimeTooltipModal',
            props: { order_time_info_message: 'Orders will expire if they aren’t completed within this time.' },
        });
    });
});
