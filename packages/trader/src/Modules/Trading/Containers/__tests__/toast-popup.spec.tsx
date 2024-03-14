import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../../../../trader-providers';
import { ToastPopup, NetworkStatusToastErrorPopup } from '../toast-popup';

const mocked_props_toast_popup = {
    portal_id: 'popup_root_1',
    children: <div>test</div>,
    className: '',
    is_open: true,
    onClose: jest.fn(),
    onClick: jest.fn(),
    timeout: 0,
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Toast: () => <div>Toast component</div>,
    MobileWrapper: () => <div>MobileWrapper component</div>,
}));

describe('<ToastPopup />', () => {
    let container: HTMLDivElement;
    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.createPortal(<ToastPopup {...mocked_props_toast_popup} />, container);
    });

    it('should render <ToastPopup /> component if portal_id exist in the document', () => {
        container.setAttribute('id', 'popup_root_1');
        render(<ToastPopup {...mocked_props_toast_popup} />);

        expect(screen.getByText(/Toast component/i)).toBeInTheDocument();
    });
    it('should not render <ToastPopup /> component if portal_id do not exist in the document', () => {
        container.setAttribute('id', 'popup_root');
        render(<ToastPopup {...mocked_props_toast_popup} />);

        expect(screen.queryByText(/Toast component/i)).not.toBeInTheDocument();
    });
});

describe('<NetworkStatusToastErrorPopup />', () => {
    const mockNetworkStatusToastErrorPopup = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <NetworkStatusToastErrorPopup />
            </TraderProviders>
        );
    };
    let container;
    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.setAttribute('id', 'popup_root');
        document.body.appendChild(container);
        ReactDOM.createPortal(<NetworkStatusToastErrorPopup />, container);
    });

    it('should render <NetworkStatusToastError /> inside of <NetworkStatusToastErrorPopup /> if message or portal id exist', () => {
        const mock_root_store = mockStore({
            common: { network_status: { tooltip: 'test tooltip', class: 'test class' } },
        });
        render(mockNetworkStatusToastErrorPopup(mock_root_store));

        expect(screen.getByText(/MobileWrapper component/i)).toBeInTheDocument();
    });
    it('should not render <NetworkStatusToastError /> if message or portal id do not exist', () => {
        const mock_root_store = mockStore({});
        render(mockNetworkStatusToastErrorPopup(mock_root_store));

        expect(screen.queryByText(/MobileWrapper component/i)).not.toBeInTheDocument();
    });
});
