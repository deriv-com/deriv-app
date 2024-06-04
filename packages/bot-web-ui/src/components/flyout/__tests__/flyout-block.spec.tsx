import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import FlyoutBlock from '../flyout-block';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

window.Blockly = {
    inject: () => ({
        isFlyout: true,
    }),
    Xml: {
        domToBlock: () => ({
            getHeightWidth: () => '200px',
            isInFlyout: true,
            moveBy: () => ({}),
            getSvgRoot: () => ({}),
        }),
    },
    bindEventWithChecks_: () => ({}),
    bindEvent_: () => ({}),
    svgResize: () => ({}),
};

describe('<FlyoutBlock />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store?.dashboard?.setWebSocketState(false);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the FlyoutBlock component', () => {
        const { container } = render(<FlyoutBlock block_node={undefined} should_hide_display_name={false} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should show the FlyoutBlock element', () => {
        render(<FlyoutBlock block_node={undefined} should_hide_display_name={false} />, {
            wrapper,
        });
        const flyout = screen.getByTestId('flyout-block-workspace');
        expect(flyout).toBeInTheDocument();
    });
});
