import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BarriersList from '../barriers-list';

const turbos_barrier_choices = ['16', '33', '40'];
const classname = 'trade-container__barriers-table__item';
const mockClickCallback = jest.fn();
const mockHoverCallback = jest.fn();

describe('Barriers List component', () => {
    beforeEach(() => {
        render(
            <BarriersList
                active_item_classname={`${classname}--selected`}
                base_classname={classname}
                selected_item={turbos_barrier_choices[0]}
                className='trade-container__barriers-table__list'
                list={turbos_barrier_choices}
                onClick={mockClickCallback}
                onHover={mockHoverCallback}
            />
        );
    });

    it('All of barriers options should be rendered', () => {
        turbos_barrier_choices.forEach(barrier => expect(screen.getByTestId(`${barrier}`)).toBeInTheDocument());
    });

    it('Selected barrier should have a proper className', () => {
        expect(screen.getByTestId(turbos_barrier_choices[0])).toHaveClass(`${classname} ${classname}--selected`);
    });

    it('Not selected barriers options should have a proper className', () => {
        expect(screen.getByTestId(turbos_barrier_choices[0])).toHaveClass(classname);
    });

    it('After clicking on second option clickHandler should be called', () => {
        userEvent.click(screen.getByTestId(turbos_barrier_choices[1]));

        expect(mockClickCallback).toHaveBeenCalled();
    });

    it('After hover on third option hoverHandler should be called', () => {
        userEvent.hover(screen.getByTestId(turbos_barrier_choices[2]));

        expect(mockHoverCallback).toHaveBeenCalled();
    });

    it('After mouseLeave event on third option hoverHandler should be called with null', () => {
        userEvent.unhover(screen.getByTestId(turbos_barrier_choices[2]));

        expect(mockHoverCallback).toHaveBeenCalledWith(null);
    });
});
