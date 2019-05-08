import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import ContractTypeWidget     from '../contract-type-widget.jsx';

configure({ adapter: new Adapter() });

describe('ContractTypeWidget', () => {
    const list = {
        'Up/Down': [
            { value:'rise_fall', text:'Rise/Fall' },
            { value:'high_low', text:'Higher/Lower' },
        ],
        'Touch/No Touch': [
            { value:'touch', text:'Touch/No Touch' }
        ]
    };
    const itemList = [
        { value:'rise_fall', text:'Rise/Fall' },
        { value:'high_low', text:'Higher/Lower' },
        { value:'touch', text:'Touch/No Touch' }
    ];
    it('should render one <ContractTypeWidget /> component', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} />);
        expect(wrapper).to.have.length(1);
    });
    it('should toggle is_dialog_open in state and set is_info_dialog_open to false onWidgetClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} />);
        wrapper.setState({ is_dialog_open: false });
        wrapper.find('.contract-type-widget__display').simulate('click');
        expect(wrapper.state('is_dialog_open')).to.be.true;
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
        wrapper.find('.contract-type-widget__display').simulate('click');
        expect(wrapper.state('is_dialog_open')).to.be.false;
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
    });
    it('should make is_dialog_open in state equal to false on handleVisibility', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} />);
        wrapper.setState({ is_dialog_open: true });
        const instance = wrapper.instance();
        instance.handleVisibility();
        expect(wrapper.state('is_dialog_open')).to.be.false;
    });
    it('should make is_info_dialog_open in state equal to false on handleInfoVisibility', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} />);
        wrapper.setState({ is_info_dialog_open: true });
        const instance = wrapper.instance();
        instance.handleInfoVisibility();
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
        instance.handleInfoVisibility();
        expect(wrapper.state('is_info_dialog_open')).to.be.true;
    });
    it('should make is_dialog_open in state equal to false on handleVisibility', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} />);
        wrapper.setState({ is_dialog_open: false, is_info_dialog_open: true });
        const instance = wrapper.instance();
        instance.onBackButtonClick();
        expect(wrapper.state('is_dialog_open')).to.be.true;
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
    });
    it('should toggle is_dialog_open in state on handleSelect', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        wrapper.setState({ is_dialog_open: true });
        const instance = wrapper.instance();
        instance.handleSelect({ value:'rise_fall', text:'Rise/Fall' }, {target: { id: 'something' }});
        expect(wrapper.state('is_dialog_open')).to.be.false;
    });
    it('should toggle is_info_dialog_open in state on onSubmitButtonClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        wrapper.setState({ is_info_dialog_open: true });
        const instance = wrapper.instance();
        instance.onSubmitButtonClick({ value:'rise_fall', text:'Rise/Fall' });
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
    });
    it('should change state correctly on handleInfoClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        wrapper.setState({ is_info_dialog_open: true, is_dialog_open: false });
        const instance = wrapper.instance();
        instance.handleInfoClick({ value:'high_low', text:'Higher/Lower' });
        expect(wrapper.state('item')).to.deep.eql({ value:'high_low', text:'Higher/Lower' });
        expect(wrapper.state('is_info_dialog_open')).to.be.false;
        expect(wrapper.state('is_dialog_open')).to.be.true;
    });
    it('should set item in state on handleNavigationClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        wrapper.setState({ item: { value:'rise_fall', text:'Rise/Fall' } });
        const instance = wrapper.instance();
        instance.handleNavigationClick({ value:'high_low', text:'Higher/Lower' });
        expect(wrapper.state('item')).to.deep.eql({ value:'high_low', text:'Higher/Lower' });
    });
    it('should set next item in state on handleNextClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        wrapper.setState({ item: { value:'rise_fall', text:'Rise/Fall' } });
        const instance = wrapper.instance();
        instance.handleNextClick(itemList);
        expect(wrapper.state('item')).to.deep.eql({ value:'high_low', text:'Higher/Lower' });
        instance.handleNextClick(itemList);
        expect(wrapper.state('item')).to.deep.eql({ value:'touch', text:'Touch/No Touch' });
        instance.handleNextClick(itemList);
        expect(wrapper.state('item')).to.deep.eql({ value:'rise_fall', text:'Rise/Fall' });
    });
    it('should set previous item in state on handlePrevClick', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        wrapper.setState({ item: { value:'rise_fall', text:'Rise/Fall' } });
        const instance = wrapper.instance();
        instance.handlePrevClick(itemList);
        expect(wrapper.state('item')).to.deep.eql({ value:'touch', text:'Touch/No Touch' });
        instance.handlePrevClick(itemList);
        expect(wrapper.state('item')).to.deep.eql({ value:'high_low', text:'Higher/Lower' });
        instance.handlePrevClick(itemList);
        expect(wrapper.state('item')).to.deep.eql({ value:'rise_fall', text:'Rise/Fall' });
    });
    it('should return the name of item getDisplayText() which it\'s value is passed as value in props', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        const instance = wrapper.instance();
        expect(instance.getDisplayText()).to.eql('Rise/Fall');
    });
    it('should return the correct classes in getStyles() when is_dialog_open is true', () => {
        const wrapper = shallow(<ContractTypeWidget list={list} value='rise_fall' />);
        const instance = wrapper.instance();
        expect(instance.getItemList()).to.deep.eql(itemList);
    });
});
