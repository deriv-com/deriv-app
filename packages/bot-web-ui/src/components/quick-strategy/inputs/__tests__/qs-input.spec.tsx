import React from 'react';

// import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { mock_ws } from 'Utils/mock';

import QSInput from '../qs-input-label';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('<QSInputLabel />', () => {
    // const mock_onSubmit = jest.fn();
    // const initial_value = {};
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

    it('should render QSInput', () => {
        const { container } = render(<QSInput />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    // it.skip('should increase the value', () => {

    // })
});
