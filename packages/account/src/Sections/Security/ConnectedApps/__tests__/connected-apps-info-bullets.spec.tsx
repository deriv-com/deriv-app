import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ConnectedAppsInfoBullets from '../connected-apps-info-bullets';

describe('ConnectedAppsInfoBullets', () => {
    it('should render the 3 informative ordered list items', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <ConnectedAppsInfoBullets class_name='connected-apps__bullets--with-apps' />{' '}
            </StoreProvider>
        );

        const ordered_list = screen.getAllByRole('listitem');
        expect(ordered_list).toHaveLength(3);
    });
});
