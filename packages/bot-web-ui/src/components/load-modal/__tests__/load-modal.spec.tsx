import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import LoadModal from '../load-modal';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

const strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const recent_strategies = [
    { ...strategy, name: 'martingale', id: '1' },
    { ...strategy, name: 'd_alembert', id: '2' },
    { ...strategy, name: 'oscar_grind', id: '3' },
];

describe('LoadModal', () => {
    let modal_root_el: HTMLElement,
        wrapper: ({ children }: { children: JSX.Element }) => JSX.Element,
        mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);

        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store.load_modal.toggleLoadModal();
        wrapper = ({ children }: { children: JSX.Element }) => (
            <BrowserRouter>
                <StoreProvider store={mock_store}>
                    <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                        {children}
                    </DBotStoreProvider>
                </StoreProvider>
            </BrowserRouter>
        );
    });

    it('should render <LoadModal /> properly', () => {
        const { container } = render(<LoadModal />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should open full screen modal if opened on mobile', () => {
        mock_store.ui.is_mobile = true;
        render(<LoadModal />, { wrapper });

        expect(screen.getByText('Load strategy')).toBeInTheDocument();
        expect(screen.getByText('Local')).toBeInTheDocument();
        expect(screen.getByText('Google Drive')).toBeInTheDocument();
        expect(screen.queryByText('Recent')).not.toBeInTheDocument();
    });

    it('should render LocalFooter if there are recent strategies', () => {
        mock_store.ui.is_mobile = false;
        mock_DBot_store?.load_modal.setActiveTabIndex(1);
        mock_DBot_store?.load_modal.setLoadedLocalFile(new File([''], 'test-name', { type: 'text/xml' }));
        render(<LoadModal />, { wrapper });
        expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });

    it('should render RecentFooter if there are recent strategies', () => {
        mock_store.ui.is_mobile = false;
        mock_DBot_store?.load_modal.setActiveTabIndex(0);
        mock_DBot_store?.load_modal.setRecentStrategies(recent_strategies);
        render(<LoadModal />, { wrapper });
        expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });

    // [Important] Close Modal should be at the end
    it('should close preview if close is clicked', () => {
        mock_store.ui.is_mobile = true;
        render(<LoadModal />, { wrapper });
        const close_button = screen.getByTestId('dt_page_overlay_header_close');
        userEvent.click(close_button);
        expect(mock_DBot_store?.dashboard.is_preview_on_popup).toBeFalsy();
    });
});
