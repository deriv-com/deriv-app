import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasskeysLearnMore } from '../passkeys-learn-more';

describe('PasskeysLearnMore', () => {
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders the tips correctly', async () => {
        render(<PasskeysLearnMore onSecondaryButtonClick={mockOnSecondaryButtonClick} />);

        await userEvent.click(screen.getByTestId('dt_learn_more_back_button'));
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
