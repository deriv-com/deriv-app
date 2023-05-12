import React from 'react';
import { screen, render } from '@testing-library/react';
import LastDigitPointer from '../last-digit-pointer';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => 'MockedIcon'),
}));

const mocked_props = {
    position: {
        left: 10,
        top: 10,
    },
};

describe('<LastDigitPointer />', () => {
    it('should render Icon if position is defined', () => {
        render(<LastDigitPointer {...mocked_props} />);
        expect(screen.getByText(/mockedicon/i)).toBeInTheDocument();
    });
});
