import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PlatformDropdown, PlatformBox } from '../platform-dropdown';

configure({ adapter: new Adapter() });

describe('PlatformDropdown', () => {
    const portalRoot = global.document.createElement('div');
    portalRoot.setAttribute('id', 'deriv_app');
    const body = global.document.querySelector('body');
    body.appendChild(portalRoot);

    const platform_config = [
        {
            link_to: '/',
            name: 'DTrader',
        },
    ];

    it('should render one <PlatformDropdown /> component', () => {
        const wrapper = shallow(<PlatformDropdown platform_config={platform_config} />);
        expect(wrapper).toHaveLength(1);
    });

    it('should not have .platform-dropdown__list-platform if platform_config is an empty array', () => {
        const wrapper = shallow(<PlatformDropdown platform_config={[]} />);
        expect(wrapper.find('.platform-dropdown__list-platform').exists()).toBe(false);
    });

    it('should not contain <PlatformBox /> if platform_config is an empty array', () => {
        const wrapper = shallow(<PlatformDropdown platform_config={[]} />);
        expect(wrapper.find(PlatformBox)).toHaveLength(0);
    });
});
