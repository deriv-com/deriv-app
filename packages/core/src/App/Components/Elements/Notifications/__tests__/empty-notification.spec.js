import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EmptyNotification } from '../empty-notification';
import { Icon } from '@deriv/components';

configure({ adapter: new Adapter() });

describe('Notifications', () => {
    it('should render one <EmptyNotification /> component', () => {
        const wrapper = shallow(<EmptyNotification />);
        expect(wrapper).toHaveLength(1);
    });
    it("should render Icon icon='IcBell'", () => {
        const wrapper = shallow(<EmptyNotification />);
        expect(
            wrapper.contains(<Icon icon='IcBox' className='notifications-empty__icon' size={64} color='secondary' />)
        ).toBe(true);
    });
});
