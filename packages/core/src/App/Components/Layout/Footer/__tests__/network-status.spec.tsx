// TODO refactor old tests in this component
import React from 'react';
import { Popover } from '@deriv/components';
import { NetworkStatus } from '../network-status.jsx';
import { render, screen } from '@testing-library/react';

const status = {
    class: 'online',
    tooltip: 'Online',
};

describe('NetworkStatus Component', () => {
    it('should has "network-status__wrapper--is-mobile" class when the "is_mobile" is true', () => {
        render(<NetworkStatus status={status} is_mobile />);
        const divElement = screen.getByTestId('dt_network_status_id');
        expect(divElement).toHaveClass('network-status__wrapper--is-mobile');
    });

    // it('should render one <NetworkStatus /> component', () => {
    //     const wrapper = shallow(<NetworkStatus status={status} />);
    //     expect(wrapper).toHaveLength(1);
    // });
    // it('should have correct class based on class passed in status', () => {
    //     const wrapper = shallow(<NetworkStatus status={status} />);
    //     expect(wrapper.find('.network-status__circle--online').exists()).toBe(true);
    //     wrapper.setProps({ status: { class: 'offline' } });
    //     expect(wrapper.find('.network-status__circle--offline').exists()).toBe(true);
    //     wrapper.setProps({ status: { class: 'blinker' } });
    //     expect(wrapper.find('.network-status__circle--blinker').exists()).toBe(true);
    // });
    // it('should contain Tooltip message passed in status', () => {
    //     const wrapper = shallow(<NetworkStatus status={status} />);
    //     expect(
    //         wrapper.contains(
    //             <Popover classNameBubble='network-status__tooltip' alignment='top' message='Network status: Online'>
    //                 <div className='network-status__circle network-status__circle--online' />
    //             </Popover>
    //         )
    //     ).toBe(true);
    // });
    // it('should contain Popover with default message and div with only default class if status does not contain them', () => {
    //     status = {};
    //     const wrapper = shallow(<NetworkStatus status={status} />);
    //     expect(
    //         wrapper.contains(
    //             <Popover
    //                 classNameBubble='network-status__tooltip'
    //                 alignment='top'
    //                 message='Network status: Connecting to server'
    //             >
    //                 <div className='network-status__circle' />
    //             </Popover>
    //         )
    //     ).toBe(true);
    // });
});
