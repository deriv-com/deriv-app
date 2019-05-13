import React                  from 'react';
import { expect }             from 'chai';
import { fake }               from 'sinon';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { UpgradeButton }      from '../upgrade-button.jsx';

configure({ adapter: new Adapter() });

describe('UpgradeButton', () => {
    it('should render one <UpgradeButton /> component', () => {
        const wrapper = shallow(<UpgradeButton />);
        expect(wrapper).to.have.length(1);
    });
    it('should call function passed onClick', () => {
        const callback = fake();
        const wrapper = shallow(<UpgradeButton onClick={callback} />);
        wrapper.prop('onClick')();
        expect(callback.called).to.be.true;
    });
});
