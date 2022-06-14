import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CFDTopUpDemoModal from '../cfd-top-up-demo-modal.tsx';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('CFDTopUpDemoModal', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render correctly', () => {
        const { container } = render(<CFDTopUpDemoModal />);
        expect(container).toBeInTheDocument();
    });

    it('should render the Top Up Modal component', () => {
        const container = render(<CFDTopUpDemoModal is_top_up_virtual_open />);
        expect(container.queryAllByTestId('dt_top_up_virtual')).toBeInTheDocument();
    });
});
