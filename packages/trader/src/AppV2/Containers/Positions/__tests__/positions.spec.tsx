import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import * as utils from 'AppV2/Utils/positions-utils';
import { ReportsStoreProvider } from '../../../../../../reports/src/Stores/useReportsStores';
import TraderProviders from '../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import Positions from '../positions';
import userEvent from '@testing-library/user-event';

const defaultMockStore = mockStore({});
const TAB_NAME = {
    Open: 'Open',
    Closed: 'Closed',
};

jest.mock('../positions-content', () => jest.fn(() => 'mockPositionsContent'));

describe('Positions', () => {
    const mockPositions = () => {
        return (
            <BrowserRouter>
                <TraderProviders store={defaultMockStore}>
                    <ReportsStoreProvider>
                        <ModulesProvider store={defaultMockStore}>
                            <Positions />
                        </ModulesProvider>
                    </ReportsStoreProvider>
                </TraderProviders>
            </BrowserRouter>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        render(mockPositions());

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);

        const openTab = tabs[0];
        const closedTab = tabs[1];
        expect(openTab).toHaveAttribute('aria-selected', 'true');
        expect(closedTab).toHaveAttribute('aria-selected', 'false');

        expect(screen.getByText(TAB_NAME.Open)).toBeInTheDocument();
        expect(screen.getByText(TAB_NAME.Closed)).toBeInTheDocument();
    });

    it('should call setPositionURLParams with appropriate argument if user clicks on Closed tab', () => {
        const mockSetPositionURLParams = jest.spyOn(utils, 'setPositionURLParams') as jest.Mock;
        render(mockPositions());

        userEvent.click(screen.getByText(TAB_NAME.Closed));
        expect(mockSetPositionURLParams).toBeCalledWith(TAB_NAME.Closed.toLowerCase());

        userEvent.click(screen.getByText(TAB_NAME.Open));
        expect(mockSetPositionURLParams).toBeCalledWith(TAB_NAME.Open.toLowerCase());
    });
});
