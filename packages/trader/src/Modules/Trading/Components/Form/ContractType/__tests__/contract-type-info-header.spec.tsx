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
    onClickBack: jest.fn(),
    onClose: jest.fn(),
    should_render_arrow: false,
    should_render_close: false,
    title: 'Multiplier',
};

describe('<Header />', () => {
    it('should render title', () => {
        render(<Header {...mocked_props} />);

        expect(screen.getByText(/multiplier/i)).toBeInTheDocument();
    });

    it('should render arrow icon if should_render_arrow === true', () => {
        render(<Header {...mocked_props} should_render_arrow />);

        expect(screen.getByText(/mockedIcon/i)).toBeInTheDocument();
    });

    it('should render both arrow and cross icons if should_render_arrow === true and should_render_cross == true', () => {
        render(<Header {...mocked_props} should_render_arrow should_render_close />);

        expect(screen.getAllByText(/mockedIcon/i)).toHaveLength(2);
    });
});
