import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTourHandler from '../index';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('../bot-builder-tour-desktop', () => jest.fn(() => <div>BotBuilderTourDesktop</div>));
jest.mock('../bot-builder-tour-mobile', () => jest.fn(() => <div>BotBuilderTourMobile</div>));

describe('BotBuilderTourHandler', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render BotBuilderTourDesktop when is_mobile is false', () => {
        render(<BotBuilderTourHandler is_mobile={false} />, {
            wrapper,
        });

        expect(screen.getByText('BotBuilderTourDesktop')).toBeInTheDocument();
        expect(screen.queryByText('BotBuilderTourMobile')).not.toBeInTheDocument();
    });

    it('should render BotBuilderTourMobile when is_mobile is true', () => {
        render(<BotBuilderTourHandler is_mobile={true} />);

        expect(screen.getByText('BotBuilderTourMobile')).toBeInTheDocument();
        expect(screen.queryByText('BotBuilderTourDesktop')).not.toBeInTheDocument();
    });
});
