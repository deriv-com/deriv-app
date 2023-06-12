import React from 'react';
import { render } from '@testing-library/react';
import BuySell from '../buy-sell';

describe('<BuySell/>', () => {
    it('should render the component', () => {
        render(<BuySell />);
    });
});
