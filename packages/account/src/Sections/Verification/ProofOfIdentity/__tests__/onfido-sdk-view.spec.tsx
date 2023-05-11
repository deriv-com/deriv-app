import React from 'react';
import { render, screen } from '@testing-library/react';
import OnfidoSdkView from '../onfido-sdk-view';

describe('<OnfidoSdkView/>', () => {
    const mock_props = {
        is_onfido_disabled: false,
        is_onfido_container_hidden: false,
        is_confirmed: false,
        data_testid: 'dt_onfido_element',
    };

    it('should render PoiButton component', () => {
        render(<OnfidoSdkView {...mock_props} />);
        expect(screen.getByTestId(mock_props.data_testid)).toBeInTheDocument();
    });
});
