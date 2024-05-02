import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectedAppsEmpty } from '../ConnectedAppsEmpty';

describe('ConnectedAppsEmpty', () => {
    it('should render the empty apps informative text component with correct details', () => {
        render(<ConnectedAppsEmpty />);

        const emptyAppList = [
            "You currently don't have any third-party authorised apps associated with your account.",
            'Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set.',
            'As a user, you are responsible for sharing access and for actions that occur in your account (even if they were initiated by a third-party app on your behalf).',
        ];

        emptyAppList.map(listItem => {
            const text = screen.getByText(listItem);
            expect(text).toBeInTheDocument();
        });
    });
});
