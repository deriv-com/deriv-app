import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectedAppsInfo } from '../ConnectedAppsInfo';

describe('<ConnectedAppsInfo />', () => {
    beforeEach(() => {
        render(<ConnectedAppsInfo />);
    });

    it('should have title with text "What are connected apps"', () => {
        const title = screen.getByRole('heading', { name: 'What are connected apps?' });
        expect(title).toBeInTheDocument();
    });

    it('should have numbered bullet points', () => {
        const orderedlist = screen.getByRole('list');
        expect(orderedlist).toBeInTheDocument();
    });

    it('should have three ordered list items', () => {
        const listitems = screen.getAllByRole('listitem');
        expect(listitems).toHaveLength(3);
    });

    it('displays correct connected apps information', () => {
        const infoList = [
            'Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set.',
            'As a user, you are responsible for sharing access and for actions that occur in your account (even if they were initiated by a third-party app on your behalf).',
            'Please note that only third-party apps will be displayed on this page. Official Deriv apps will not appear here.',
        ];

        infoList.map(listItem => {
            const text = screen.getByText(listItem);
            expect(text).toBeInTheDocument();
        });
    });
});
