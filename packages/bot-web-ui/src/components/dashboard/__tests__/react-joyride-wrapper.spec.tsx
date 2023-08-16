import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, waitFor } from '@testing-library/react';
import { DBotStoreProvider, mockDBotStore } from '../../../stores/useDBotStore';
// import ReactJoyrideWrapper from 'Components/dashboard/react-joyride-wrapper';
import ReactJoyrideWrapper from '../react-joyride-wrapper';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('react-joyride', () => jest.fn(() => <div>ReactJoyride</div>));

describe('ReactJoyrideWrapper', () => {
    const mock_ws = {
        authorized: {
            subscribeProposalOpenContract: jest.fn(),
            send: jest.fn(),
        },
        storage: {
            send: jest.fn(),
        },
        contractUpdate: jest.fn(),
        subscribeTicksHistory: jest.fn(),
        forgetStream: jest.fn(),
        activeSymbols: jest.fn(),
        send: jest.fn(),
    };
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
        run: true,
    };

    it('should render ReactJoyrideWrapper', async () => {
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
