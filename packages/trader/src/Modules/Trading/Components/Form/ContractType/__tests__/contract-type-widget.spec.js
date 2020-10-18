import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ContractTypeWidget from '../contract-type-widget.jsx';

configure({ adapter: new Adapter() });

describe('ContractTypeWidget', () => {
    const list = {
        'Up/Down': [
            { value: 'rise_fall', text: 'Rise/Fall' },
            { value: 'high_low', text: 'Higher/Lower' },
        ],
        'Touch/No Touch': [{ value: 'touch', text: 'Touch/No Touch' }],
    };
    const itemList = [
        { value: 'rise_fall', text: 'Rise/Fall' },
        { value: 'high_low', text: 'Higher/Lower' },
        { value: 'touch', text: 'Touch/No Touch' },
    ];
    it('should render one <ContractTypeWidget /> component', () => {
        const wrapper = shallow(<ContractTypeWidget list={[]} />);
        expect(wrapper).to.have.length(1);
    });
    it('should make is_dialog_open in state equal to false on handleVisibility', () => {
        const wrapper = shallow(<ContractTypeWidget list={[]} />);
        wrapper.setState({ is_dialog_open: true });
        const instance = wrapper.instance();
        instance.handleVisibility();
        expect(wrapper.state('is_dialog_open')).to.be.false;
    });
    it('should toggle is_dialog_open in state on handleSelect', () => {
        const wrapper = shallow(<ContractTypeWidget list={[]} value='rise_fall' />);
        wrapper.setState({ is_dialog_open: true });
        const instance = wrapper.instance();
        instance.handleSelect({ value: 'rise_fall', text: 'Rise/Fall' }, { target: { id: 'something' } });
        expect(wrapper.state('is_dialog_open')).to.be.false;
    });
    it('should change state correctly on handleInfoClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={[]} value='rise_fall' />);
        wrapper.setState({ is_info_dialog_open: true, is_dialog_open: false });
        const instance = wrapper.instance();
        instance.handleInfoClick({ value: 'high_low', text: 'Higher/Lower' });
        expect(wrapper.state('item')).to.deep.eql({ value: 'high_low', text: 'Higher/Lower' });
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
    });
    it('should set item in state on handleNavigationClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={[]} value='rise_fall' />);
        wrapper.setState({ item: { value: 'rise_fall', text: 'Rise/Fall' } });
        const instance = wrapper.instance();
        instance.handleNavigationClick({ value: 'high_low', text: 'Higher/Lower' });
        expect(wrapper.state('item')).to.deep.eql({ value: 'high_low', text: 'Higher/Lower' });
    });
});
