import React from 'react';
import { Formik } from 'formik';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import { TSelectFieldProps } from '../../quick-strategy.types';
import { SelectField } from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

const props: TSelectFieldProps = {
    field_name: 'durationtype',
    id: 'duration',
    className: 'class-duration',
    label: 'Duration',
    values: {},
    select_value: 'duration-unit',
    onChangeDropdownItem: jest.fn(),
    onHideDropdownList: jest.fn(),
    onScrollStopDropdownList: jest.fn(),
    selected_trade_type: {} as any,
    selected_symbol: {} as any,
    dropdown_list: [
        {
            group: 'duration',
            text: 'Ticks',
            value: 't',
        },
        {
            group: 'duration',
            text: 'minutes',
            value: 'm',
        },
    ],
    selected_value: {
        group: 'duration',
        text: 'Ticks',
        value: 't',
    },
    setFieldValue: jest.fn(),
};
describe('SelectField', () => {
    it('should render SelectField', () => {
        (isMobile as jest.Mock).mockReturnValue(false);

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <SelectField {...props} />
            </Formik>
        );

        expect(screen.getByText('Duration')).toBeInTheDocument();
    });

    it('should render SelectField when isMobile is true', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <SelectField {...props} />
            </Formik>
        );

        expect(screen.getByText('Duration')).toBeInTheDocument();
    });
});
