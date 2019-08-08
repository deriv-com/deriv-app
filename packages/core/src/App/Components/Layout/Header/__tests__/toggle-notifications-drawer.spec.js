import React                         from 'react';
import { expect }                    from 'chai';
import { configure, shallow }        from 'enzyme';
import Adapter                       from 'enzyme-adapter-react-16';
import { ToggleNotificationsDrawer } from '../toggle-notifications-drawer.jsx';
import { Notifications }             from '../../../Elements/Notifications';

configure({ adapter: new Adapter() });

describe('ToggleNotificationsDrawer', () => {
    it('should render one <ToggleNotificationsDrawer /> component', () => {
        const wrapper = shallow(<ToggleNotificationsDrawer />);
        expect(wrapper).to.have.length(1);
    });
    it('should have <Notifications /> component', () => {
        const wrapper = shallow(<ToggleNotificationsDrawer />);
        expect(wrapper.contains(<Notifications />)).to.be.true;
    });
});
