import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import { DepositButton }      from '../deposit-button.jsx';

configure({ adapter: new Adapter() });

describe('DepositButton', () => {
    it('should render one <DepositButton /> component', () => {
        const wrapper = shallow(<DepositButton />);
        expect(wrapper).to.have.length(1);
    });
});
