import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TutorialsTab from '../tutorials';
import { Router } from 'react-router-dom';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<TutorialsTab />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const history = createBrowserHistory();
    const mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
    const handleTabChange = jest.fn();

    beforeEach(() => {
        mock_DBot_store?.quick_strategy?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Router history={history}>{children}</Router>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render tutorials tab', () => {
        const { container } = render(<TutorialsTab handleTabChange={handleTabChange} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render tutorials tab with TutorialsTabDesktop when it is a desktop version and don not show result if has_content_guide_tab equals false ', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.filterTuotrialTab('something');
        render(<TutorialsTab handleTabChange={handleTabChange} />, { wrapper });
        const tutorials_tab_desktop_component = screen.getByTestId('tutorials-tab-desktop');
        expect(tutorials_tab_desktop_component).toBeInTheDocument();
    });
});
