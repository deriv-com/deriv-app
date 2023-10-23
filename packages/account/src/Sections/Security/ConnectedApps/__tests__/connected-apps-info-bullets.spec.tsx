import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectedAppsInfoBullets from '../connected-apps-info-bullets';

describe('ConnectedAppsInfoBullets', () => {
    it('should render the 3 informative ordered list items', () => {
        render(<ConnectedAppsInfoBullets text_size='xs' />);

        const ordered_list = screen.getAllByRole('listitem');
        expect(ordered_list).toHaveLength(3);
    });
});
