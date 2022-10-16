import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ClosingAccountReasonFrom from '../closing-account-reason-form';

describe('<ClosingAccountReasonFrom />', () => {
    test('rendering and submitting a basic form', async () => {
        const handleSubmit = jest.fn();
        const validateFields = jest.fn();
        const handleChangeCheckbox = (values, name, setFieldValue) => {
            setFieldValue(name, !values[name]);
        };
        const handleInputChange = (e, _, onChange) => {
            onChange(e);
        };

        render(
            <ClosingAccountReasonFrom
                onSubmit={handleSubmit}
                validateFields={validateFields}
                onChangeCheckbox={handleChangeCheckbox}
                onInputChange={handleInputChange}
            />
        );

        act(() => {
            fireEvent.change(screen.getByPlaceholderText(/What could we do to improve/i), {
                target: { value: 'do_to_improve' },
            });
            fireEvent.change(
                screen.getByPlaceholderText(/If you don’t mind sharing, which other trading platforms do you use/i),
                { target: { value: 'other_trading_platforms' } }
            );
        });

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
        });

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    do_to_improve: 'do_to_improve',
                    other_trading_platforms: 'other_trading_platforms',
                }),
                expect.anything()
            );
        });
    });
});
