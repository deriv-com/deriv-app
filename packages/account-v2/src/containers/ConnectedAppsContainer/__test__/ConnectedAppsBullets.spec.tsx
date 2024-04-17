import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectedAppsBullets } from '../ConnectedAppsBullets';

describe('ConnectedAppsBullets', () => {
    it('should render the three ordered list items', () => {
        render(<ConnectedAppsBullets color='less-prominent' style='flex flex-col' />);

        const orderedList = screen.getAllByRole('listitem');
        expect(orderedList).toHaveLength(3);
    });
});
