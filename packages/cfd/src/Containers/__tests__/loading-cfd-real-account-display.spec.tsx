import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingCFDRealAccountDisplay from '../loading-cfd-real-account-display';

jest.mock('../../templates/_common/components/loading', () => jest.fn(() => <div>Loading</div>));

describe('<LoadingCFDRealAccountDisplay />', () => {
    it('component should be rendered', () => {
        render(<LoadingCFDRealAccountDisplay />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
