import React from 'react';
import { expect } from 'chai';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ContractTypeItem from '../contract-type-item.jsx';

configure({ adapter: new Adapter() });

describe('ContractTypeItem', () => {
    it('should render one <ContractTypeItem /> component', () => {
        const contracts = [
            { value: 'rise_fall', text: 'Rise/Fall' },
            { value: 'high_low', text: 'Higher/Lower' },
        ];
        const wrapper = shallow(<ContractTypeItem contract_types={contracts} />);
        expect(wrapper).to.have.length(2);
    });

    it('should has --selected class when clicked', () => {
        const clickMock = jest.fn();
        const contracts = [
            { value: 'rise_fall', text: 'Rise/Fall' },
            { value: 'high_low', text: 'Higher/Lower' },
        ];
        const wrapper = mount(<ContractTypeItem contract_types={contracts} handleSelect={clickMock} />);
        const item = wrapper.find('#dt_contract_rise_fall_item');
        item.simulate('click');
        expect(clickMock.mock.calls.length).to.be.equal(1);
    });
});
