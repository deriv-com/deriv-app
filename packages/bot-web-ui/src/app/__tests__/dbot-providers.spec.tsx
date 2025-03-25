import React from 'react';
import { mockStore, useStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from '../../utils/mock';
import DBotProviders from '../dbot-providers';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@jimdanielswasswa/test-chart', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const TestStoreComponent = () => {
    const { common } = useStore();
    const { platform } = common;
    return <div>{platform}</div>;
};

describe('DBotProviders', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;

    beforeAll(() => {
        const mock_store = mockStore({ common: { platform: 'ctrader' } });
        wrapper = ({ children }: { children: JSX.Element }) => (
            <DBotProviders store={mock_store} WS={mock_ws}>
                {children}
            </DBotProviders>
        );
    });

    it('should render DBotProviders with children', () => {
        render(<div>Test</div>, {
            wrapper,
        });
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should access useStore platform value from component', () => {
        render(<TestStoreComponent />, {
            wrapper,
        });
        expect(screen.getByText('ctrader')).toBeInTheDocument();
    });
});
