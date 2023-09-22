import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop } from '@deriv/shared';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import Verification from '../verification';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => false),
}));

const mock_modal_manager = {
    isCurrentModal: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
    random: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

const mocked_store_values = {
    is_advertiser: false,
    nickname: '',
    poi_status: '',
    poiStatusText: jest.fn(),
    toggleNicknamePopup: jest.fn(),
    props: {
        history: '',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { ...mocked_store_values },
    })),
}));

describe('<Verification />', () => {
    it('should render default state', () => {
        render(<Verification />);

        const el_dp2p_verification_container = screen.getByTestId('dt_verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
    });

    it('Should show nickname checklist item as done if user has nickname', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, nickname: 'test', poi_status: 'verified', is_advertiser: true },
        });

        render(<Verification />);

        const el_dp2p_verification_container = screen.getByTestId('dt_verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
    });

    it('Should toggle nickname popup if user has not set nickname', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, is_advertiser: true },
        });

        render(<Verification />);

        const action_button = screen.getAllByTestId('dt_checklist_item_status_action')[0];
        expect(action_button).toBeInTheDocument();
        userEvent.click(action_button);
        expect(mocked_store_values.toggleNicknamePopup).toBeCalledTimes(1);
    });

    it('Should open nickname form in desktop if user has not set nickname', () => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, is_advertiser: true },
        });

        render(<Verification />);

        const action_button = screen.getAllByTestId('dt_checklist_item_status_action')[0];
        expect(action_button).toBeInTheDocument();
        userEvent.click(action_button);
        expect(mock_modal_manager.showModal).toBeCalledTimes(1);
    });

    it('Should redirect to account poi verification if poi has not been verified', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, nickname: 'test', is_advertiser: true },
        });

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });

        render(<Verification />);

        const el_action_button = screen.getByTestId('dt_checklist_item_status_action');
        userEvent.click(el_action_button);
        expect(window.location.href).toBe('/account/proof-of-identity?ext_platform_url=/cashier/p2p');
    });

    it('Should redirect to account poi verification with updated url when search param is present and poi not verified', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, nickname: 'test', is_advertiser: true },
        });

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
                search: '?test=1',
            },
            writable: true,
        });

        render(<Verification />);

        const el_action_button = screen.getByTestId('dt_checklist_item_status_action');
        userEvent.click(el_action_button);
        expect(window.location.href).toBe('/account/proof-of-identity?ext_platform_url=/cashier/p2p&test=1');
    });

    it('Should render Dp2pBlocked component if user is not advertiser, but is poi verified and has nickname', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, poi_status: 'verified', nickname: 'test' },
        });

        render(<Verification />);

        const el_dp2p_Dp2pBlocked_container = screen.getByTestId('dt_dp2p-blocked-container');
        expect(el_dp2p_Dp2pBlocked_container).toBeInTheDocument();
    });

    it('Should render empty content when nickname form is open', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: { ...mocked_store_values, should_show_popup: true },
        });

        const { container } = render(<Verification />);

        expect(container).toBeEmptyDOMElement();
    });
});
