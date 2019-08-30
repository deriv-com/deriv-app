import React                  from 'react';
import { expect }             from 'chai';
import { fake }               from 'sinon';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { TogglePositions }    from '../toggle-positions.jsx';
import Icon                   from 'Assets/icon.jsx';

configure({ adapter: new Adapter() });

describe('TogglePositions', () => {
    it('should render one <TogglePositions /> component', () => {
        const wrapper = shallow(<TogglePositions />);
        expect(wrapper).to.have.length(1);
    });
    it('should have active class when is_positions_drawer_on is true', () => {
        const wrapper = shallow(<TogglePositions is_positions_drawer_on={true} />);
        expect(wrapper.find('.ic-positions--active').exists()).to.be.true;
    });
    it('should not have active class when is_positions_drawer_on is false', () => {
        const wrapper = shallow(<TogglePositions is_positions_drawer_on={false} />);
        expect(wrapper.find('.ic-positions--active').exists()).to.be.false;
    });
    it('should contain <Icon icon=\'IconPositions\' />', () => {
        const wrapper = shallow(<TogglePositions />);
        expect(wrapper.contains(<Icon icon='IconPositions' className='footer__icon ic-positions__icon' />)).to.be.true;
    });
    it('should call twDrawer passed onClick', () => {
        const callback = fake();
        const wrapper = shallow(<TogglePositions togglePositionsDrawer={callback} />);
        wrapper.prop('onClick')();
        expect(callback.called).to.be.true;
    });
});
