import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ToggleMenuDrawer       from '../toggle-menu-drawer.jsx';
import MenuDrawer             from '../../../../Containers/Drawer/menu-drawer.jsx';

configure({ adapter: new Adapter() });

describe('ToggleMenuDrawer', () => {
    it('should render one <ToggleMenuDrawer /> component', () => {
        const wrapper = shallow(<ToggleMenuDrawer />);
        expect(wrapper).to.have.length(1);
    });
    it('should have <MenuDrawer /> component', () => {
        const wrapper = shallow(<ToggleMenuDrawer />);
        expect(wrapper.contains(<MenuDrawer />)).to.be.true;
    });
});
