import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrencyIcon from '../CurrencyIcon';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    CurrencyAudIcon: jest.fn(({ iconSize }) => <div>CurrencyAudIcon-{iconSize}</div>),
}));

describe('<CurrencyIcon />', () => {
    it('should render the correct currency icon', () => {
        render(<CurrencyIcon currency='AUD' size='sm' />);

        expect(screen.getByText('CurrencyAudIcon-sm')).toBeInTheDocument();
    });
});
