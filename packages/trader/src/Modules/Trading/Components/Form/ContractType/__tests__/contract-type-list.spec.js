import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ContractTypeList from '../contract-type-list.jsx';

configure({ adapter: new Adapter() });

describe('ContractTypeList', () => {
    const list = {
        'Up/Down': [
            { value: 'rise_fall', text: 'Rise/Fall' },
            { value: 'high_low', text: 'Higher/Lower' },
        ],
        'Touch/No Touch': [{ value: 'touch', text: 'Touch/No Touch' }],
    };
    it('should render one <ContractTypeList /> component', () => {
        const wrapper = shallow(<ContractTypeList list={list['Up/Down']} />);
        expect(wrapper).to.have.length(2);
    });
});
