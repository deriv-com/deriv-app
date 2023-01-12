// TODO refactor old tests in this component
import { render } from '@testing-library/react';
import React from 'react';
import { PlatformDropdown, PlatformBox } from '../platform-dropdown';

const mockFunction = jest.fn();

describe('PlatformDropdown', () => {
    // const portalRoot = global.document.createElement('div');
    // portalRoot.setAttribute('id', 'deriv_app');
    // const body = global.document.querySelector('body');
    // body.appendChild(portalRoot);

    const platform_config = [
        {
            link_to: '/',
            name: 'DTrader',
        },
    ];

    it('should render one <PlatformDropdown /> component', () => {
        // render(
        //     <PlatformDropdown app_routing_history={{}} closeDrawer={mockFunction} platform_config={platform_config} />
        // );
        // const wrapper = shallow(<PlatformDropdown platform_config={platform_config} />);
        // expect(wrapper).toHaveLength(1);
    });

    // it('should not have .platform-dropdown__list-platform if platform_config is an empty array', () => {
    //     const wrapper = shallow(<PlatformDropdown platform_config={[]} />);
    //     expect(wrapper.find('.platform-dropdown__list-platform').exists()).toBe(false);
    // });

    // it('should not contain <PlatformBox /> if platform_config is an empty array', () => {
    //     const wrapper = shallow(<PlatformDropdown platform_config={[]} />);
    //     expect(wrapper.find(PlatformBox)).toHaveLength(0);
    // });
});
