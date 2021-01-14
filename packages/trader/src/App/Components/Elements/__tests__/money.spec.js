import React from 'react';
import { expect } from 'chai';
import { Money } from '@deriv/components';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Money', () => {
    it('should render one <Money /> component', () => {
        const wrapper = shallow(<Money />);
        expect(wrapper).to.have.length(1);
    });
    it('should return correct text based on props when number is > 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={+10} />);
        expect(wrapper.text().trim()).to.be.equal('+10.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={10} />);
        expect(wrapper.text().trim()).to.be.equal('+10.00');
    });
    it('should return correct text based on props when number is < 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={-10} />);
        expect(wrapper.text().trim()).to.be.equal('-10.00');
    });
    it('should return correct text based on props when number is 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={0} />);
        expect(wrapper.text().trim()).to.be.equal('0.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign is true (should_format is false)', () => {
        const wrapper = shallow(<Money has_sign={true} should_format={false} amount={+10} />);
        expect(wrapper.text().trim()).to.be.equal('+10');
    });
    it('should return correct text based on props when number is > 0 and has_sign is true (should_format is false)', () => {
        const wrapper = shallow(<Money has_sign={true} should_format={false} amount={10} />);
        expect(wrapper.text().trim()).to.be.equal('+10');
    });
    it('should return correct text based on props when number is < 0 and has_sign is true (should_format is false)', () => {
        const wrapper = shallow(<Money has_sign={true} should_format={false} amount={-10.5} />);
        expect(wrapper.text().trim()).to.be.equal('-10.5');
    });
    it('should return correct text based on props when number is 0 and has_sign is true (should_format is false)', () => {
        const wrapper = shallow(<Money has_sign={true} should_format={false} amount={0} />);
        expect(wrapper.text().trim()).to.be.equal('0');
    });
    it('should return correct text based on props when number is > 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={+10} />);
        expect(wrapper.text().trim()).to.be.equal('10.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={10} />);
        expect(wrapper.text().trim()).to.be.equal('10.00');
    });
    it('should return correct text based on props when number is < 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={-10.5} />);
        expect(wrapper.text().trim()).to.be.equal('10.50');
    });
    it('should return correct text based on props when number is 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={0} />);
        expect(wrapper.text().trim()).to.be.equal('0.00');
    });
});
