import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import IdvFailed from '../idv-failed';
import { idv_error_statuses } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        wait: jest.fn().mockResolvedValue(true),
    },
    filterObjProperties: jest.fn(() => ({
        document_type: {
            id: '',
            text: '',
            value: '',
            example_format: '',
            sample_image: '',
        },
        document_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
    })),
}));

jest.mock('Components/forms/personal-details-form', () => jest.fn(() => <div>PersonalDetailsForm</div>));
jest.mock('Components/forms/idv-form', () => jest.fn(() => <div>IDVForm</div>));
jest.mock('Assets/ic-poi-name-example.svg', () => jest.fn(() => 'PoiNameExample'));
jest.mock('Assets/ic-poi-dob-example.svg', () => jest.fn(() => 'PoiDobExample'));
jest.mock('Assets/ic-poi-name-dob-example.svg', () => jest.fn(() => 'PoiNameDobExample'));

describe('<IdvFailed/>', () => {
    const mock_props = {
        getChangeableFields: jest.fn(() => []),
        is_from_external: false,
        residence_list: [],
        handleSubmit: jest.fn(),
        account_settings: {
            citizen: 'gh',
        },
        mismatch_status: idv_error_statuses.poi_name_mismatch,
    };

    it('should render IDVfailed component with name mismatch message', async () => {
        render(<IdvFailed {...mock_props} />);

        await waitFor(() => {
            expect(screen.getByTestId(idv_error_statuses.poi_name_mismatch)).toBeInTheDocument();
            expect(screen.getByText('PersonalDetailsForm')).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with dob mismatch message', async () => {
        const new_props = { ...mock_props, mismatch_status: idv_error_statuses.poi_dob_mismatch };
        render(<IdvFailed {...new_props} />);

        await waitFor(() => {
            expect(screen.getByTestId(idv_error_statuses.poi_dob_mismatch)).toBeInTheDocument();
            expect(screen.queryByText('IDVForm')).not.toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with name & DOB mismatch message', async () => {
        const new_props = { ...mock_props, mismatch_status: idv_error_statuses.poi_name_dob_mismatch };
        render(<IdvFailed {...new_props} />);

        await waitFor(() => {
            expect(screen.getByTestId(idv_error_statuses.poi_name_dob_mismatch)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Update profile/i })).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with expired message', async () => {
        const new_props = { ...mock_props, mismatch_status: idv_error_statuses.poi_expired };
        render(<IdvFailed {...new_props} />);

        await waitFor(() => {
            expect(screen.getByTestId(idv_error_statuses.poi_expired)).toBeInTheDocument();
            expect(screen.getByText('IDVForm')).toBeInTheDocument();
            expect(screen.getByText('PersonalDetailsForm')).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with verification failed message', async () => {
        const new_props = { ...mock_props, mismatch_status: idv_error_statuses.poi_failed };
        render(<IdvFailed {...new_props} />);

        await waitFor(() => {
            expect(screen.getByTestId(idv_error_statuses.poi_failed)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
        });
    });
});
