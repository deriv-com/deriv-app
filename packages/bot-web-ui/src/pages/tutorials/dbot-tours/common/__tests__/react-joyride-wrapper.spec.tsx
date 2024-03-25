import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ReactJoyrideWrapper from '../react-joyride-wrapper';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('react-joyride', () => jest.fn(() => <div>ReactJoyride</div>));
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('ReactJoyrideWrapper', () => {
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    const mocked_props = {
        steps: [
            {
                target: '.animation__wrapper',
                content: <div>Content step 1</div>,
            },
            {
                target: '.animation__wrapper',
                content: <div>Content step 2</div>,
            },
        ],
        styles: {},
        handleCallback: jest.fn(),
        run: true,
    };

    it('should render ReactJoyrideWrapper', () => {
        render(
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <ReactJoyrideWrapper {...mocked_props} />
                </DBotStoreProvider>
            </StoreProvider>
        );

        expect(screen.getByText('ReactJoyride')).toBeInTheDocument();
    });
});
