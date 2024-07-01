import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';
import { CONTRACT_LIST, TERM, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import Guide from '../guide';

const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);
Loadable.preloadAll();

describe('Guide', () => {
    it('should render component', () => {
        render(<Guide />);

        expect(screen.getByText('Guide')).toBeInTheDocument();
        expect(screen.getByText('Trade types')).toBeInTheDocument();
        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('should render minimalistic component if is_minimalistic_look === true', () => {
        render(<Guide is_minimalistic_look />);

        expect(screen.queryByText('Guide')).not.toBeInTheDocument();
        expect(screen.getByText('Trade types')).toBeInTheDocument();
        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('should set correct contract type if user clicked on chip', () => {
        const mockSelectedContractType = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [CONTRACT_LIST['RISE/FALL'], mockSelectedContractType])
            .mockImplementationOnce(() => ['', jest.fn()]);

        render(<Guide />);

        userEvent.click(screen.getByText('Guide'));

        userEvent.click(screen.getByText(CONTRACT_LIST.ACCUMULATORS));
        expect(mockSelectedContractType).toHaveBeenCalledWith(CONTRACT_LIST.ACCUMULATORS);
    });

    it('should render term definition if user clicked on it', () => {
        render(<Guide />);

        const term_definition = 'You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.';
        expect(screen.queryByText(term_definition)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('Guide'));
        userEvent.click(screen.getByText(CONTRACT_LIST.ACCUMULATORS));
        userEvent.click(screen.getByRole('button', { name: TERM.GROWTH_RATE.toLowerCase() }));

        expect(screen.getByText(term_definition)).toBeInTheDocument();
    });
});
