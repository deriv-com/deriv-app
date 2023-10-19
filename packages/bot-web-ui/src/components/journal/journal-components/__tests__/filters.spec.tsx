import React from 'react';
import Filters from '../filters';
import { render, screen } from '@testing-library/react';
import { message_types } from '@deriv/bot-skeleton';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const journal_filters = [
    { id: message_types.ERROR, label: 'Errors' },
    { id: message_types.NOTIFY, label: 'Notifications' },
    { id: message_types.SUCCESS, label: 'System' },
];

const mockFilterMessage = jest.fn();

const createMockRef = React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;

describe('<Filters />', () => {
    it('should render filter component', () => {
        render(
            <Filters
                wrapper_ref={createMockRef}
                checked_filters={journal_filters}
                filters={journal_filters}
                filterMessage={mockFilterMessage}
                className='sample-classname'
                classNameLabel='sample-classname-label'
                id='test'
            />
        );
        const el = screen.getByText('Errors');
        userEvent.click(el);
        // eslint-disable-next-line testing-library/no-node-access
        const element = document.querySelector('.dc-checkbox__box.dc-checkbox__box--active');
        expect(element).toHaveClass('dc-checkbox__box--active');
    });
});
