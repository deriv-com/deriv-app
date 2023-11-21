import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ConnectedAppsEmpty from '../connected-apps-empty';

describe('ConnectedAppsEmpty', () => {
    const renderComponent = (mock_store = mockStore({})) =>
        render(
            <StoreProvider store={mock_store}>
                <ConnectedAppsEmpty />
            </StoreProvider>
        );

    it('should render the empty apps informative text component with correct details', () => {
        renderComponent();

        expect(
            screen.getByText(/You currently don't have any third-party authorised apps associated with your account./i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /As a user, you are responsible for sharing access and for actions that occur in your account \(even if they were initiated by a third-party app on your behalf\)./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Please note that only third-party apps will be displayed on this page. Official Deriv apps will not appear here./i
            )
        ).toBeInTheDocument();
    });
});
