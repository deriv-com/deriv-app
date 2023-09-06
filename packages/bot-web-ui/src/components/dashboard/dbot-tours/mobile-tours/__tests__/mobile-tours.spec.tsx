import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import MobileTours from '../mobile-tours';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));
describe('<MobileTours />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render OnboardingTour tour', () => {
        mock_DBot_store?.dashboard.setOnBoardTourRunState(true);
        render(<MobileTours />, {
            wrapper,
        });
        expect(screen.getByTestId('onboarding-tour-mobile')).toBeInTheDocument();
    });

    it('should render BotBuilderTour tour', () => {
        mock_DBot_store?.dashboard.setOnBoardTourRunState(false);
        render(<MobileTours />, {
            wrapper,
        });
        expect(screen.getByTestId('botbuilder-tour-mobile')).toBeInTheDocument();
    });
});
