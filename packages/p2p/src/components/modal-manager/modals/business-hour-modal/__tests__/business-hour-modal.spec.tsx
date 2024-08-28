import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BusinessHourModal from '../business-hour-modal';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';

const mockFn = jest.fn();
const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
    useSavedState: jest.fn(() => [false, mockFn]),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PSettings: jest.fn().mockReturnValue({
        p2p_settings: {
            business_hours_minutes_interval: 15,
        },
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

const el_modal = document.createElement('div');

describe('<BusinessHourModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('it should render the Main screen for business hour modal', () => {
        render(<BusinessHourModal />);

        expect(screen.getByText('Business hours')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Set the hours you’re available to accept orders. Your ads will only be visible to others during these times.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '*Some ads may not be immediately visible to potential buyers due to order processing times.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit business hours' })).toBeInTheDocument();
    });

    it('should show the edit screen when user clicks on Edit button', () => {
        render(<BusinessHourModal />);

        const edit_button = screen.getByRole('button', { name: 'Edit business hours' });

        userEvent.click(edit_button);

        expect(mockFn).toHaveBeenCalledWith(true);
    });

    it('should hide the edit screen if the user clicks on Cancel button', () => {
        mock_modal_manager.useSavedState = jest.fn(() => [true, mockFn]);
        render(<BusinessHourModal />);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancel_button);
        expect(mockFn).toHaveBeenCalledWith(false);
    });

    it('should show the mobile view when isMobile is true for the main screen', () => {
        mockUseDevice.mockReturnValueOnce({ isMobile: true });
        mock_modal_manager.useSavedState = jest.fn(() => [false, mockFn]);

        render(<BusinessHourModal />);

        expect(screen.getByText('Business hours')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Set the hours you’re available to accept orders. Your ads will only be visible to others during these times.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '*Some ads may not be immediately visible to potential buyers due to order processing times.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit business hours' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_mobile_full_page_return_icon')).toBeInTheDocument();
    });

    it('should call hideModal when the user clicks on the back button', () => {
        mockUseDevice.mockReturnValueOnce({ isMobile: true });
        render(<BusinessHourModal />);

        const back_button = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(back_button);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should show edit page on mobile if the user clicks on Edit button', () => {
        mockUseDevice.mockReturnValueOnce({ isMobile: true });
        render(<BusinessHourModal />);

        const edit_button = screen.getByRole('button', { name: 'Edit business hours' });

        userEvent.click(edit_button);

        expect(mockFn).toHaveBeenCalledWith(true);
    });

    it('should hide the edit screen if user clicks on back button from edit screen', () => {
        mockUseDevice.mockReturnValueOnce({ isMobile: true });
        mock_modal_manager.useSavedState = jest.fn(() => [true, mockFn]);
        render(<BusinessHourModal />);

        const back_button = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(back_button);

        expect(mockFn).toHaveBeenCalledWith(false);
    });
});
