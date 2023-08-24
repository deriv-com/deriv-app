import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import IconButton from '../icon-button';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mockOnClick = jest.fn();

describe('IconButton', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        jest.resetModules();
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

    it('should render the IconButton component', () => {
        const { container } = render(
            <IconButton icon={'icon'} icon_id={'icon_id'} iconOnClick={mockOnClick} popover_message={''} />,
            {
                wrapper,
            }
        );
        expect(container).toBeInTheDocument();
    });

    it('should render the Icon', () => {
        render(<IconButton icon={'icon'} icon_id={'icon_id'} iconOnClick={mockOnClick} popover_message={''} />);
        expect(screen.getByTestId('icon_button')).toBeInTheDocument();
    });

    it('shoud fire onClick method on click', () => {
        render(<IconButton icon={'icon'} icon_id={'icon_id'} iconOnClick={mockOnClick} popover_message={''} />);
        const icon_element = screen.getByTestId('icon_button');
        expect(icon_element).toBeInTheDocument();
        act(() => {
            fireEvent.click(icon_element);
        });
        expect(mockOnClick).toHaveBeenCalled();
    });
});
