import React from 'react';
import { render, screen } from '@testing-library/react';
import { SwipeableContractAudit, SwipeableContractDrawer } from '../swipeable-components';

const mocked_children = 'Mocked children';

describe('<SwipeableContractAudit />', () => {
    const default_mocked_props = {
        is_multiplier: true,
        onSwipedDown: jest.fn(),
    };

    const modal = document.createElement('div');
    beforeAll(() => {
        document.body.appendChild(modal);
    });
    afterAll(() => {
        document.body.removeChild(modal);
    });

    it('should render passed children', () => {
        modal.setAttribute('id', 'dt_contract_drawer_audit');
        render(
            <SwipeableContractAudit {...default_mocked_props}>
                <div>{mocked_children}</div>
            </SwipeableContractAudit>
        );

        expect(screen.getByText(mocked_children)).toBeInTheDocument();
    });
    it('should not render anything if id in modal is different from dt_contract_drawer_audit', () => {
        modal.setAttribute('id', 'modal_root');
        const { container } = render(
            <SwipeableContractAudit {...default_mocked_props}>
                <div>{mocked_children}</div>
            </SwipeableContractAudit>
        );

        expect(container).toBeEmptyDOMElement();
    });
});

describe('<SwipeableContractDrawer />', () => {
    const default_mocked_props = {
        onSwipedDown: jest.fn(),
        onSwipedUp: jest.fn(),
    };
    it('should render passed children', () => {
        render(<SwipeableContractDrawer {...default_mocked_props}>{mocked_children}</SwipeableContractDrawer>);

        expect(screen.getByText(mocked_children)).toBeInTheDocument();
    });
});
