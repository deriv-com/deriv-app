import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import SameDOBPhoneModal from '../same-dob-phone-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../same-dob-phone-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    SameDOBPhoneModalContent: () => <div>Content</div>,
}));

describe('<SameDOBPhoneModal />', () => {
    let modal_root_el: HTMLDivElement;

    const setShouldShowSameDOBPhoneModal = jest.fn();

    const mockDefault = mockStore({
        ui: {
            should_show_same_dob_phone_modal: true,
            setShouldShowSameDOBPhoneModal,
        },
    });

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        modal_root_el.setAttribute('data-testid', 'dt_test_modal');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render modal for desktop', () => {
        render(<SameDOBPhoneModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render modal for responsive', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        render(<SameDOBPhoneModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should call setShouldShowSameDOBPhoneModal with false when try to close modal', () => {
        render(<SameDOBPhoneModal />, {
            wrapper: wrapper(),
        });

        const close_button = screen.getByRole('button', {
            name: '',
        });
        userEvent.click(close_button);

        expect(setShouldShowSameDOBPhoneModal).toHaveBeenCalledWith(false);
    });
});
