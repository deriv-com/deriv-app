import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTour from '../../mobile-tours/bot-builder-tour';
import OnboardingTour from '../../mobile-tours/onboarding-tour';
import { BOT_BUILDER_MOBILE, BOT_BUILDER_TOUR, DBOT_ONBOARDING, DBOT_ONBOARDING_MOBILE } from '../index';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));
describe('Tour Config Data', () => {
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
    it('DBOT_ONBOARDING_MOBILE is called', () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const firstStep = Object.values(DBOT_ONBOARDING_MOBILE)[0];
        expect(screen.getByText(firstStep.header)).toBeInTheDocument();
    });

    it('BOT_BUILDER_MOBILE is called', () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const firstStep = Object.values(BOT_BUILDER_MOBILE)[0];
        expect(screen.getByText(firstStep.header)).toBeInTheDocument();
    });
});
