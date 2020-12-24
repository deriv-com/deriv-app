import React from 'react';
import { expect } from 'chai';
import { fake } from 'sinon';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TogglePositions from '../toggle-positions.jsx';
import { Icon } from '@deriv/components';

configure({ adapter: new Adapter() });

describe('TogglePositions', () => {
    it('should render one <TogglePositions /> component', () => {
        const wrapper = shallow(<TogglePositions />);
        expect(wrapper).to.have.length(1);
    });
    it('should have active class when is_positions_drawer_on is true', () => {
        const wrapper = shallow(<TogglePositions is_open={true} />);
        expect(wrapper.find('.positions-toggle--active').exists()).to.be.true;
    });
    it('should not have active class when is_positions_drawer_on is false', () => {
        const wrapper = shallow(<TogglePositions is_open={false} />);
        expect(wrapper.find('.positions-toggle--active').exists()).to.be.false;
    });
    it("should contain <Icon icon='IcPortfolio' />", () => {
        const wrapper = shallow(<TogglePositions />);
        expect(wrapper.contains(<Icon icon='IcPortfolio' className='positions-toggle__icon' />)).to.be.true;
    });
    it('should call twDrawer passed onClick', () => {
        const callback = fake();
        const wrapper = shallow(<TogglePositions togglePositions={callback} />);
        wrapper.prop('onClick')();
        expect(callback.called).to.be.true;
    });
});
