import { jest } from '@jest/globals';
import { Provider } from 'mobx-react';
import { MobxContentProvider } from '../../../Stores/connect.js';
import RootStore from '../../../Stores';
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import PersonalDetailsForm from './personal-details.jsx';
import fc from 'fast-check';

const mock_root_store = {
    client: {
        fetchResidenceList: jest.fn(),
    },
};
const WS_mock = jest.mock('Services/ws-methods', () => {
    return {
        wait: jest.fn(() => Promise.resolve()),
    };
});

afterEach(cleanup);

describe('<PersonalDetailsForm />', () => {
    it('should_render_successfully', () => {
        const root_store = new RootStore(mock_root_store);
        expect(
            render(
                <MobxContentProvider store={root_store}>
                    <PersonalDetailsForm />
                </MobxContentProvider>
            )
        ).toBeTruthy();
    });
});
