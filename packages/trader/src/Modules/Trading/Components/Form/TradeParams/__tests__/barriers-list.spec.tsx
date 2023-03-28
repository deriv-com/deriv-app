import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BarriersList from '../barriers-list';

const barrier_choices = ['16', '33', '40'];
const classname = 'trade-container__barriers-table__item';
const mockClickCallback = jest.fn();
const mockHoverCallback = jest.fn();
const mockClickCrossCallback = jest.fn();

describe('<BarriersList/>', () => {
    beforeEach(() => {
        render(
            <BarriersList
                active_item_classname={`${classname}--selected`}
                base_classname={classname}
                header='Barriers'
                selected_item={barrier_choices[0]}
                show_table
                subheader='Distance to current spot'
                className='trade-container__barriers-table__list'
                list={barrier_choices}
                onClick={mockClickCallback}
                onClickCross={mockClickCrossCallback}
                onHover={mockHoverCallback}
            />
        );
    });
    it('all barrier options should be rendered', () => {
        barrier_choices.forEach(barrier => expect(screen.getByTestId(barrier)).toBeInTheDocument());
    });
    it('selected barrier should have a proper className', () => {
        expect(screen.getByTestId(barrier_choices[0])).toHaveClass(`${classname} ${classname}--selected`);
    });
    it('non-selected barrier option should have a proper className', () => {
        expect(screen.getByTestId(barrier_choices[1])).toHaveClass(classname);
        expect(screen.getByTestId(barrier_choices[1])).not.toHaveClass(`${classname} ${classname}--selected`);
    });
    it('click handler should be called after clicking on the 2nd barrier option (33)', () => {
        userEvent.click(screen.getByTestId(barrier_choices[1]));

        expect(mockClickCallback).toHaveBeenCalled();
    });
    it('hover handler should be called when the 3rd barrier option (40) is hovered', () => {
        userEvent.hover(screen.getByTestId(barrier_choices[2]));

        expect(mockHoverCallback).toHaveBeenCalled();
    });
    it('hover handler should be called with null when mouseLeave event fires on the 3rd barrier option (40)', () => {
        userEvent.unhover(screen.getByTestId(barrier_choices[2]));

        expect(mockHoverCallback).toHaveBeenCalledWith(null);
    });
});
