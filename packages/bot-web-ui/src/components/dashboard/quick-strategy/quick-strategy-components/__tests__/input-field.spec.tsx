import React from 'react';
import { Formik } from 'formik';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import { TInputFieldProps } from '../../quick-strategy.types';
import { InputField } from '..';

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

const props: TInputFieldProps = {
    field_name: 'stake',
    id: 'stake',
    className: 'class-stake',
    label: 'Stake',
    placeholder: '0',
    trailing_icon_message: '',
    errors: {},
    handleChange: jest.fn(),
    onChangeInputValue: jest.fn(),
    setCurrentFocus: jest.fn(),
    type: 'number',
};
describe('InputField', () => {
    it('should render InputField', () => {
        (isMobile as jest.Mock).mockReturnValue(false);

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <InputField {...props} />
            </Formik>
        );

        expect(screen.getByText('Stake')).toBeInTheDocument();
    });

    it('should display necessary classNmaes for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <InputField {...props} />
            </Formik>
        );

        expect(screen.getByTestId('dt_input_field_div')).not.toHaveClass('quick-strategy__form-row--multiple');
    });
});
