import React from 'react';
import { render, screen } from '@testing-library/react';
import BuySell from '../BuySell';

jest.mock('../../BuySellTable/BuySellTable', () => jest.fn(() => <div>BuySellTable</div>));

describe('<BuySell />', () => {
    it('should render the BuySell Component', () => {
        render(<BuySell />);

        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
    });
});
