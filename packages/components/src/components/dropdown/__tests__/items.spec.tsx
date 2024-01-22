import React from 'react';
import { render, screen } from '@testing-library/react';
import Items from '../items';

describe('<Items />', () => {
    let mocked_default_props: React.ComponentProps<typeof Items>;

    beforeEach(() => {
        mocked_default_props = {
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
        render(<Items {...mocked_default_props} />);

        expect(screen.getByText('Multipliers')).toBeInTheDocument();
        expect(screen.getByText('Accumulators')).toBeInTheDocument();
    });

    it('should call setScrollHeight function if value === item.value', () => {
        render(<Items {...mocked_default_props} />);

        expect(mocked_default_props.setScrollHeight).toBeCalled();
    });
    it('should not call setScrollHeight function if value !== item.value', () => {
        mocked_default_props.value = 'vanilla';
        render(<Items {...mocked_default_props} />);

        expect(mocked_default_props.setScrollHeight).not.toBeCalled();
    });
});
