import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import CreateAd from '../create-ad';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        setApiErrorMessage: jest.fn(),
        setShowAdForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

jest.mock('../create-ad-form', () => {
    const CreateAdForm = () => <div>CreateAdForm</div>;
    return CreateAdForm;
});

describe('<CreateAd/>', () => {
    it('should render the create ad page', () => {
        render(<CreateAd />);

        expect(screen.getByText('Create new ad')).toBeInTheDocument();
    });
    it('should close the create ad page on clicking back button', () => {
        render(<CreateAd />);

        const back_button = screen.getByTestId('dt_page_return_icon');
        userEvent.click(back_button);
        expect(mocked_store_values.my_ads_store.setApiErrorMessage).toBeCalledTimes(1);
        expect(mocked_store_values.my_ads_store.setShowAdForm).toHaveBeenLastCalledWith(false);
    });
});
