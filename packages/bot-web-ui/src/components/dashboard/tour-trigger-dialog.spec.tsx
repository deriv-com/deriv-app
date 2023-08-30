import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import RootStore from '../../stores/root-store';
import { DBotStoreProvider, mockDBotStore } from '../../stores/useDBotStore';
import { setTourType } from './joyride-config';
import TourTriggrerDialog from './tour-trigger-dialog';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => ({
    blocksCoordinate: jest.fn(),
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

describe('<TourTriggrerDialog />', () => {
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

    it('renders tour trigger component', () => {
        const { container } = render(<TourTriggrerDialog />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should open tour trigger dialog', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });
        expect(screen.getByText(/Get started on Deriv Bot/i)).toBeInTheDocument();
    });

    it('should show tour end message', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setHasTourEnded(true);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });
        expect(screen.getByText(/Want to retake the tour?/i)).toBeInTheDocument();
    });

    it('should start onboarding tour', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setActiveTab(1);
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setHasTourEnded(false);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });

        act(() => {
            const buttonElement = screen.getByText('Start', { selector: 'span' });
            fireEvent.click(buttonElement);
        });

        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should show tour success message', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setActiveTab(1);
            mock_DBot_store?.dashboard?.setHasTourEnded(true);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });
        expect(screen.getByTestId('tour-success-message')).toBeInTheDocument();
    });

    it('should cancel tour', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setActiveTab(1);
            mock_DBot_store?.dashboard?.setHasTourEnded(true);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });

        act(() => {
            const buttonElement = screen.getByText('Skip', { selector: 'span' });
            fireEvent.click(buttonElement);
        });

        expect(mock_DBot_store?.dashboard?.is_tour_dialog_visible).toBeFalsy();
    });

    it('should render bot builder tour', () => {
        act(() => {
            mock_DBot_store?.dashboard?.setActiveTab(1);
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setHasTourEnded(false);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });
        expect(screen.getByText("Let's build a Bot!")).toBeInTheDocument();
    });

    it('should start bot builder tour', () => {
        act(() => {
            setTourType('bot_builder');
            mock_DBot_store?.dashboard?.setActiveTab(2);
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setHasTourEnded(false);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });

        act(() => {
            const buttonElement = screen.getByText('Start', { selector: 'span' });
            fireEvent.click(buttonElement);
        });

        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should exit bot builder tour', () => {
        act(() => {
            setTourType('bot_builder');
            mock_DBot_store?.dashboard?.setActiveTab(2);
            mock_DBot_store?.dashboard?.setTourDialogVisibility(true);
            mock_DBot_store?.dashboard?.setHasTourEnded(true);
        });
        render(<TourTriggrerDialog />, {
            wrapper,
        });

        act(() => {
            const buttonElement = screen.getByText('Skip', { selector: 'span' });
            fireEvent.click(buttonElement);
        });

        expect(mock_DBot_store?.dashboard?.is_tour_dialog_visible).toBeFalsy();
    });
});
