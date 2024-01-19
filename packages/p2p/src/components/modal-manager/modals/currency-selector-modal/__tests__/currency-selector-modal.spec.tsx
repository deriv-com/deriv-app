import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { P2PSettingsProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import CurrenySelectorModal from '../currency-selector-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        onLocalCurrencySelect: jest.fn(),
        selected_local_currency: 'IDR',
    },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <P2PSettingsProvider>{children}</P2PSettingsProvider>
    </APIProvider>
);

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PSettings: jest.fn().mockReturnValue({
        p2p_settings: {
            currency_list: [
                { display_name: 'Indonesian Rupiah', text: 'IDR', value: 'IDR', is_default: true },
                { display_name: 'New Zealand Dollar', text: 'NZD', value: 'NZD', has_adverts: true },
            ],
        },
    }),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_store,
}));

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

describe('<CurrenySelectorModal/>', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render the CurrenySelectorModal', () => {
        render(<CurrenySelectorModal />, { wrapper });

        expect(screen.getByText('Preferred currency')).toBeInTheDocument();
    });
    it('should handle currency selection', () => {
        render(<CurrenySelectorModal />, { wrapper });

        userEvent.click(screen.getByText('NZD'));

        expect(mock_store.buy_sell_store.onLocalCurrencySelect).toBeCalledWith('NZD');
        expect(mock_modal_manager.hideModal).toBeCalled();
    });
});
