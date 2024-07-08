import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import Loadable from 'react-loadable';
import App from '../app';

const root_store = mockStore({});
const routes = 'Routes';
const trade_modals = 'Trade Modals';

jest.mock('../Containers/routes', () => jest.fn(() => <div>{routes}</div>));
jest.mock('../Components/Modals/trade-modals.tsx', () => jest.fn(() => <div>{trade_modals}</div>));

describe('App', () => {
    it('should render the component without Trade Modals if it was not loaded', () => {
        render(<App passthrough={{ root_store }} />);

        expect(screen.getByText(routes)).toBeInTheDocument();
        expect(screen.queryByText(trade_modals)).not.toBeInTheDocument();
    });

    it('should render the component with Trade Modals', async () => {
        render(<App passthrough={{ root_store }} />);

        await waitFor(() => Loadable.preloadReady());

        expect(screen.getByText(routes)).toBeInTheDocument();
        expect(screen.getByText(trade_modals)).toBeInTheDocument();
    });
});
