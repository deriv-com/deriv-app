import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormProgress from './form-progress';

Enzyme.configure({ adapter: new Adapter() });

describe('Form-progress', () => {

    const steps = [
        {
            current_step: {
                header: {
                    title: 'some_title',
                    active_title: 'some_title'
                }
            }
        }
    ];

    it('props.steps should not be undefined', () => {
        const wrapper = shallow(<FormProgress />);
        expect(wrapper.find(steps).exists()).to.be.false;
    });

    it('should not have .dc-form-progress__step if props.steps is empty array', () => {
        const wrapper = shallow(<FormProgress steps={ [] } />);
        expect(wrapper.find('.dc-form-progress__step').exists()).to.be.false;
    });

    it('should have .dc-form-progress__step if props.steps is not an empty array', () => {
        const wrapper = shallow(<FormProgress steps={ steps } />);
        expect(wrapper.find('.dc-form-progress__step').exists()).to.be.true;
    });

    if('steps[current_step].header.active_title must not be undefined', () => {
        const wrapper = shallow(<FormProgress steps={ steps } />);
        expect(wrapper.find(steps[current_step].header.active_title).exists()).to.be.true;
    });
});