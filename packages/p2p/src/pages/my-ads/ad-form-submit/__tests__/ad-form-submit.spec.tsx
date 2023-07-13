import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdFormSubmit from '../ad-form-submit';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

const mock_props = {
    ad_option: 'create',
    check_dirty: true,
    current_method: {
        key: 'key',
        is_deleted: false,
    },
    handleEditAdFormCancel: jest.fn(),
    onCleanup: jest.fn(),
    payment_method_details: {
        '0': {
            display_name: 'Bank transfer',
            is_enabled: 1,
            method: 'bank_transfer',
            type: 'fiat',
            used_by_adverts: null,
            used_by_orders: null,
            fields: {
                account: {
                    display_name: 'Account',
                    required: 0,
                    type: 'text',
                    value: '',
                },
                instructions: {
                    display_name: 'Instructions',
                    required: 0,
                    type: 'text',
                    value: '',
                },
            },
        },
    },
    payment_method_names: ['Bank transfer'],
    selected_methods: ['0'],
};

describe('<AdFormSubmit/>', () => {
    beforeEach(() => {
        mockUseFormikContext.mockReturnValue({
            dirty: true,
            isSubmitting: false,
            isValid: true,
            values: [],
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the AdFormSubmit component', () => {
        render(<AdFormSubmit {...mock_props} />);

        expect(screen.getByText('Post ad')).toBeInTheDocument();
    });
    it('should render the AdFormSubmit component with "save changes" button for edit option', () => {
        const new_props = { ...mock_props, ad_option: 'edit' };
        render(<AdFormSubmit {...new_props} />);

        expect(screen.getByText('Save changes')).toBeInTheDocument();
    });
    it('should call the onCleanup function on clicking cancel button for create option', () => {
        render(<AdFormSubmit {...mock_props} />);

        const post_ad_button = screen.getByText('Cancel');

        expect(post_ad_button).toBeInTheDocument();
        userEvent.click(post_ad_button);
        expect(mock_props.onCleanup).toBeCalledTimes(1);
    });
    it('should call the handleEditAdFormCancel function on clicking cancel button for edit option', () => {
        const new_props = { ...mock_props, ad_option: 'edit' };
        render(<AdFormSubmit {...new_props} />);

        const post_ad_button = screen.getByText('Cancel');

        expect(post_ad_button).toBeInTheDocument();
        userEvent.click(post_ad_button);
        expect(mock_props.handleEditAdFormCancel).toBeCalledTimes(1);
    });
});
