import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import RootStore from '../../../stores/root-store';
import { DBotStoreProvider, mockDBotStore } from '../../../stores/useDBotStore';
import BotSnackbar from '../bot-snackbar';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

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

jest.useFakeTimers();

describe('BotSnackbar', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mockHandleClose = jest.fn();
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
    it('should render BotSnackbar with correct message', () => {
        const test_message = 'message test';
        render(<BotSnackbar message={test_message} handleClose={mockHandleClose} is_open={true} />, {
            wrapper,
        });
        expect(screen.getByText(test_message)).toBeInTheDocument();
    });

    it('should not render BotSnackbar if snack bar is not opened', () => {
        const test_message = 'message test';
        render(<BotSnackbar message={test_message} handleClose={mockHandleClose} is_open={false} />, {
            wrapper,
        });
        expect(screen.queryByText(test_message)).not.toBeInTheDocument();
    });

    it('should render close button if snackbar is open', () => {
        render(<BotSnackbar message='test' handleClose={mockHandleClose} is_open={true} />, {
            wrapper,
        });
        const cls_btn = screen.getByTestId('bot-snackbar-notification-close');
        expect(cls_btn).toBeInTheDocument();
    });

    it('should hanlde close function on click close button', async () => {
        render(<BotSnackbar message='test' handleClose={mockHandleClose} is_open={true} />, {
            wrapper,
        });
        const cls_btn = screen.getByTestId('bot-snackbar-notification-close');
        await userEvent.click(cls_btn);
        expect(mockHandleClose).toBeCalled();
    });

    it('should close snackbar after timeout is passed and mouse is not over the snackbar', async () => {
        render(<BotSnackbar message='test' handleClose={mockHandleClose} is_open={true} timeout={4000} />, {
            wrapper,
        });
        const element = screen.getByTestId('bot-snackbar-notification-container');
        act(() => {
            fireEvent.mouseLeave(element);
            jest.advanceTimersByTime(4100);
        });
        const cls_btn = screen.queryByTestId('bot-snackbar-notification-close');
        expect(cls_btn).not.toBeInTheDocument();
    });
});
