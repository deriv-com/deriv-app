import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ToggleCashier          from '../toggle-cashier.jsx';

configure({ adapter: new Adapter() });

describe('ToggleCashier', () => {
    it('should render one <ToggleCashier /> component', () => {
        const wrapper = shallow(<ToggleCashier />);
        expect(wrapper).to.have.length(1);
    });
});
