import React from 'react';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import Toolbox from '../toolbox';
import { StoreProvider, mockStore } from '@deriv/stores';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mockGetBoundingClientRect = jest.fn(() => ({
    top: 10,
    left: 20,
    right: 30,
    bottom: 40,
    width: 10,
    height: 20,
}));

window.Blockly = {
    svgBlockCanvas_: {
        getBoundingClientRect: mockGetBoundingClientRect,
    },
    Colours: { RootBlock: {} },
};

describe('Toolbox component', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile: true,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    // it('should render Toolbox with content wrapper is open', () => {
    //render(<Toolbox />, { wrapper });
    // screen.debug()
    // expect(screen.getByTestId('dashboard__toolbox')).toBeInTheDocument();
    // expect(screen.getByTestId('db-toolbox__content-wrapper')).toHaveClass('db-toolbox__content-wrapper active');
    //});
    // it('should render Toolbox with content wrapper is open', () => {
    //     const setVisibility = jest.fn();
    //     (useDBotStore as jest.Mock).mockReturnValue({ ...mockDbotStore, flyout: { setVisibility } });
    //     render(<Toolbox />, { wrapper });
    //     expect(screen.getByTestId('db-toolbox__title')).toBeInTheDocument();

    //     userEvent.click(screen.getByTestId('db-toolbox__title'));
    //     expect(screen.getByTestId('db-toolbox__content-wrapper')).not.toHaveClass('db-toolbox__content-wrapper active');
    //     expect(setVisibility).toHaveBeenCalled();
    // });
    // it('should not render Toolbox if it is mobile version', () => {
    //     render(<Toolbox />, { wrapper });
    //     if (isMobile()) {
    //         expect(screen.getByRole('dashboard__toolbox')).toBeEmptyDOMElement();
    //     }
    // });
});
