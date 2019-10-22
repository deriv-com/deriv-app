import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { Notifications }      from '../notifications.jsx';
import { EmptyNotification }  from 'App/Components/Elements/Notifications/empty-notification';

configure({ adapter: new Adapter() });

describe('Notifications', () => {
    it('should render one <Notifications /> component', () => {
        const wrapper = shallow(<Notifications />);
        expect(wrapper).to.have.length(1);
    });
    it('should render .no-notifications-container when the list is not passed', () => {
        const wrapper = shallow(<Notifications />);
        expect(wrapper.find(EmptyNotification).exists()).to.be.true;
    });
    it('should not render .no-notifications-container when the list is passed', () => {
        const wrapper = shallow(<Notifications list={['First', 'Second', 'Third']} />);
        expect(wrapper.find(EmptyNotification).exists()).to.be.false;
    });
});
