import React from 'react';
import { screen, render } from '@testing-library/react';
import Header from '../ContractTypeInfo/contract-type-info-header';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});

const mocked_props = {
    onClickGoBack: jest.fn(),
    title: 'Multiplier',
};

describe('<Header />', () => {
    it('should render Icon and title', () => {
        render(<Header {...mocked_props} />);
        expect(screen.getByText(/mockedIcon/i)).toBeInTheDocument();
        expect(screen.getByText(/multiplier/i)).toBeInTheDocument();
    });
});
