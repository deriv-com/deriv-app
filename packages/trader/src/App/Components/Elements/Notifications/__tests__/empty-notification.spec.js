import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { EmptyNotification }  from '../empty-notification';
import Icon                   from 'Assets/icon.jsx';

configure({ adapter: new Adapter() });

describe('Notifications', () => {
    it('should render one <EmptyNotification /> component', () => {
        const wrapper = shallow(<EmptyNotification />);
        expect(wrapper).to.have.length(1);
    });
    it('should render Icon icon=\'IconBell\'', () => {
        const wrapper = shallow(<EmptyNotification />);
        expect(wrapper.contains(<Icon icon='IconBell' className='drawer__bell-icon' />)).to.be.true;
    });
});
