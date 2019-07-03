import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Money                  from '../money.jsx';

configure({ adapter: new Adapter() });

describe('Money', () => {
    it('should render one <Money /> component', () => {
        const wrapper = shallow(<Money />);
        expect(wrapper).to.have.length(1);
    });
    it('should have lowercase USD as class when currency is not passed', () => {
        const wrapper = shallow(<Money />);
        expect(wrapper.find('.symbols--usd').exists()).to.be.true;
    });
    it('should have lowercase currency as class when passed', () => {
        const wrapper = shallow(<Money currency='AUD' />);
        expect(wrapper.find('.symbols--aud').exists()).to.be.true;
    });
    it('should return correct text based on props when number is > 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={+10} />);
        expect(wrapper.text()).to.be.equal('+10.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={10} />);
        expect(wrapper.text()).to.be.equal('+10.00');
    });
    it('should return correct text based on props when number is < 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={-10} />);
        expect(wrapper.text()).to.be.equal('-10.00');
    });
    it('should return correct text based on props when number is 0 and has_sign is true', () => {
        const wrapper = shallow(<Money has_sign={true} amount={0} />);
        expect(wrapper.text()).to.be.equal('0.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign is true (is_formatted is false)', () => {
        const wrapper = shallow(<Money has_sign={true} is_formatted={false} amount={+10} />);
        expect(wrapper.text()).to.be.equal('+10');
    });
    it('should return correct text based on props when number is > 0 and has_sign is true (is_formatted is false)', () => {
        const wrapper = shallow(<Money has_sign={true} is_formatted={false} amount={10} />);
        expect(wrapper.text()).to.be.equal('+10');
    });
    it('should return correct text based on props when number is < 0 and has_sign is true (is_formatted is false)', () => {
        const wrapper = shallow(<Money has_sign={true} is_formatted={false} amount={-10.5} />);
        expect(wrapper.text()).to.be.equal('-10.5');
    });
    it('should return correct text based on props when number is 0 and has_sign is true (is_formatted is false)', () => {
        const wrapper = shallow(<Money has_sign={true} is_formatted={false} amount={0} />);
        expect(wrapper.text()).to.be.equal('0');
    });
    it('should return correct text based on props when number is > 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={+10} />);
        expect(wrapper.text()).to.be.equal('10.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={10} />);
        expect(wrapper.text()).to.be.equal('10.00');
    });
    it('should return correct text based on props when number is < 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={-10.50} />);
        expect(wrapper.text()).to.be.equal('10.50');
    });
    it('should return correct text based on props when number is 0 and has_sign is false', () => {
        const wrapper = shallow(<Money has_sign={false} amount={0} />);
        expect(wrapper.text()).to.be.equal('0.00');
    });
    it('should return correct text based on props when number is > 0 and has_sign and is_formatted are false', () => {
        const wrapper = shallow(<Money has_sign={false} is_formatted={false} amount={+10} />);
        expect(wrapper.text()).to.be.equal('10');
    });
    it('should return correct text based on props when number is < 0 and has_sign and is_formatted are false', () => {
        const wrapper = shallow(<Money has_sign={false} is_formatted={false} amount={-10} />);
        expect(wrapper.text()).to.be.equal('10');
    });
    it('should return correct text based on props when number is 0 and has_sign and is_formatted are false', () => {
        const wrapper = shallow(<Money has_sign={false} is_formatted={false} amount={0} />);
        expect(wrapper.text()).to.be.equal('0');
    });
});
