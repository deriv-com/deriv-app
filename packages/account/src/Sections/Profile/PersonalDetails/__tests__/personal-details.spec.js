import { jest, test } from '@jest/globals';
import React from 'react';
import { cleanup, render, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PersonalDetailsForm } from '../personal-details.jsx';
import { StoreProvider, mockStore } from '@deriv/stores';

afterAll(cleanup);

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
    useWS: () => undefined,
}));

describe('<PersonalDetailsForm />', () => {
    let store = mockStore();
    const history = createBrowserHistory();

    it('should_render_successfully', async () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();

        const promise = Promise.resolve();
        const fetchResidenceList = jest.fn(() => promise);
        const fetchStatesList = jest.fn(() => promise);
        const residence_list = [
            {
                text: 'Text',
                value: 'value',
            },
        ];
        store = mockStore({
            client: {
                account_settings: {
                    email_consent: 1,
                },
                is_virtual: false,
                states_list: residence_list,
                residence_list: residence_list,
                has_residence: true,
                getChangeableFields: () => [],
                fetchResidenceList: fetchResidenceList,
                fetchStatesList: fetchStatesList,
            },
        });

        // store.client.fetchResidenceList = fetchResidenceList;
        // store.client.fetchStatesList = fetchStatesList;
        // store.client.residence_list = residence_list;
        // store.client.account_settings = {
        //     email_consent: 1,
        // };
        // store.client.is_virtual = false;
        // store.client.states_list = residence_list;
        // store.client.getChangeableFields = () => [];
        // store.client.has_residence = true;
        const screen = render(
            <Router history={history}>
                <StoreProvider store={store}>
                    <PersonalDetailsForm />
                </StoreProvider>
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.container.querySelector('.account__initial-loader'));
        await waitFor(() =>
            screen.getByText(/Please make sure your information is correct or it may affect your trading experience./i)
        );
    });

    test.todo('Personal details component tests for different landing companies');
    test.todo('Personal detail update Profile');
});
