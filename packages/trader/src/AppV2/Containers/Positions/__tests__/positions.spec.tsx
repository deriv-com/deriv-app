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

const localStorage_key = 'guide_dtrader_v2';
const defaultMockStore = mockStore({
    modules: {
        positions: { onUnmount: jest.fn() },
    },
    client: { is_logged_in: true },
});

jest.mock('../positions-content', () => jest.fn(() => 'mockPositionsContent'));
jest.mock('AppV2/Components/OnboardingGuide/GuideForPages', () => jest.fn(() => 'OnboardingGuide'));

describe('Positions', () => {
    const mockPositions = () =>
        render(
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

    beforeAll(() => {
        Element.prototype.scrollTo = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('should render component', () => {
        mockPositions();

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);

        const openTab = tabs[0];
        const closedTab = tabs[1];
        expect(openTab).toHaveAttribute('aria-selected', 'true');
        expect(closedTab).toHaveAttribute('aria-selected', 'false');

        expect(screen.getByText(utils.TAB_NAME.OPEN)).toBeInTheDocument();
        expect(screen.getByText(utils.TAB_NAME.CLOSED)).toBeInTheDocument();
        expect(screen.getByText('OnboardingGuide')).toBeInTheDocument();
    });

    it('should call setPositionURLParams with appropriate argument if user clicks on Closed tab', () => {
        const mockSetPositionURLParams = jest.spyOn(utils, 'setPositionURLParams') as jest.Mock;
        mockPositions();

        userEvent.click(screen.getByText(utils.TAB_NAME.CLOSED));
        expect(mockSetPositionURLParams).toBeCalledWith(utils.TAB_NAME.CLOSED.toLowerCase());

        userEvent.click(screen.getByText(utils.TAB_NAME.OPEN));
        expect(mockSetPositionURLParams).toBeCalledWith(utils.TAB_NAME.OPEN.toLowerCase());
    });

    it('should not render OnboardingGuide if localStorage flag is equal to true', () => {
        const field = { positions_page: true };
        localStorage.setItem(localStorage_key, JSON.stringify(field));

        mockPositions();

        expect(screen.queryByText('OnboardingGuide')).not.toBeInTheDocument();
    });

    it('should not render OnboardingGuide if client is not logged in', () => {
        defaultMockStore.client.is_logged_in = false;
        mockPositions();

        expect(screen.queryByText('OnboardingGuide')).not.toBeInTheDocument();
    });
});
