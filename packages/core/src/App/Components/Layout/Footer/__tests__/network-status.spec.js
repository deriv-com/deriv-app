import { expect } from 'chai';
import { Popover } from '@deriv/components';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { NetworkStatus } from '../network-status.jsx';

configure({ adapter: new Adapter() });

describe('NetworkStatus', () => {
    let status = {
        class: 'online',
        tooltip: 'Online',
    };
    it('should render one <NetworkStatus /> component', () => {
        const wrapper = shallow(<NetworkStatus status={status} />);
        expect(wrapper).to.have.length(1);
    });
    it('should have correct class based on class passed in status', () => {
        const wrapper = shallow(<NetworkStatus status={status} />);
        expect(wrapper.find('.network-status__circle--online').exists()).to.be.true;
        wrapper.setProps({ status: { class: 'offline' } });
        expect(wrapper.find('.network-status__circle--offline').exists()).to.be.true;
        wrapper.setProps({ status: { class: 'blinker' } });
        expect(wrapper.find('.network-status__circle--blinker').exists()).to.be.true;
    });
    it('should contain Tooltip message passed in status', () => {
        const wrapper = shallow(<NetworkStatus status={status} />);
        expect(
            wrapper.contains(
                <Popover classNameBubble='network-status__tooltip' alignment='top' message='Network status: Online'>
                    <div className='network-status__circle network-status__circle--online' />
                </Popover>
            )
        ).to.be.true;
    });
    it('should contain Popover with default message and div with only default class if status does not contain them', () => {
        status = {};
        const wrapper = shallow(<NetworkStatus status={status} />);
        expect(
            wrapper.contains(
                <Popover
                    classNameBubble='network-status__tooltip'
                    alignment='top'
                    message='Network status: Connecting to server'
                >
                    <div className='network-status__circle' />
                </Popover>
            )
        ).to.be.true;
    });
});
