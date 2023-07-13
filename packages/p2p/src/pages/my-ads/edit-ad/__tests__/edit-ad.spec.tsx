import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import EditAd from '../edit-ad';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        getAdvertInfo: jest.fn(),
        is_form_loading: false,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

jest.mock('../edit-ad-form', () => {
    const EditAdForm = () => <div>Edit Ad Form</div>;
    return EditAdForm;
});

jest.mock('@deriv/components', () => ({
    Loading: () => <div>Loading</div>,
}));

describe('<EditAd/>', () => {
    it('should render the edit ad page', () => {
        render(<EditAd />);

        expect(mocked_store_values.my_ads_store.getAdvertInfo).toBeCalledTimes(1);
        expect(screen.getByText('Edit Ad Form')).toBeInTheDocument();
    });
    it('should render Loading component when form is loading', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                is_form_loading: true,
            },
        });
        render(<EditAd />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
