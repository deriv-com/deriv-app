import React from 'react';
import { render, screen } from '@testing-library/react';
import Items from '../items';

describe('<Items />', () => {
    let mockedDefaultProps: React.ComponentProps<typeof Items>;

    beforeEach(() => {
        mockedDefaultProps = {
            handleSelect: jest.fn(),
            onKeyPressed: jest.fn(),
            value: 'multiplier',
            nodes: null,
            items: [
                { text: 'Multipliers', value: 'multiplier' },
                { text: 'Accumulators', value: 'accumulator' },
            ],
            setScrollHeight: jest.fn(),
        };
    });

    it('should render list of passed items', () => {
        render(<Items {...mockedDefaultProps} />);

        expect(screen.getByText('Multipliers')).toBeInTheDocument();
        expect(screen.getByText('Accumulators')).toBeInTheDocument();
    });

    it('should call setScrollHeight function if value === item.value', () => {
        render(<Items {...mockedDefaultProps} />);

        expect(mockedDefaultProps.setScrollHeight).toBeCalled();
    });
    it('should not call setScrollHeight function if value !== item.value', () => {
        mockedDefaultProps.value = 'vanilla';
        render(<Items {...mockedDefaultProps} />);

        expect(mockedDefaultProps.setScrollHeight).not.toBeCalled();
    });
});
