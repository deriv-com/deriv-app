import { expect } from 'chai';
import { configure, mount, shallow } from 'enzyme';

import React from 'react';
import { fake } from 'sinon';
import ToggleButton from '../toggle-button.jsx';
import ToggleButtonGroup from '../toggle-button-group.jsx';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<ToggleButtonGroup />', () => {
    it('should render a <ToggleButtonGroup /> element', () => {
        const wrapper = shallow(
            <ToggleButtonGroup>
                <ToggleButton value='test'>Test</ToggleButton>
            </ToggleButtonGroup>
        );

        expect(wrapper.find('div').childAt(0).type()).to.equal(ToggleButton);
    });

    describe('prop: onChange', () => {
        it('should be called when one of the toggle_buttons is clicked', () => {
            const callback = fake();
            const wrapper = mount(
                <ToggleButtonGroup onChange={callback}>
                    <ToggleButton value='test-one'>Test One</ToggleButton>
                    <ToggleButton value='test-two'>Test Two</ToggleButton>
                </ToggleButtonGroup>
            );

            wrapper.find(ToggleButton).at(0).simulate('click');
            expect(callback.callCount).to.equal(1);
        });

        describe('single choice', () => {
            it('should be called when one of the toggle_buttons is clicked with value of the button', () => {
                const callback = fake();
                const wrapper = mount(
                    <ToggleButtonGroup onChange={callback}>
                        <ToggleButton value='test-one'>Test One</ToggleButton>
                        <ToggleButton value='test-two'>Test Two</ToggleButton>
                    </ToggleButtonGroup>
                );

                wrapper.find(ToggleButton).at(0).simulate('click');
                expect(callback.callCount).to.equal(1);
                expect(callback.args[0][1]).to.equal('test-one');
            });
            it('should be called when one of the toggle_buttons is clicked with null value', () => {
                const callback = fake();
                const wrapper = mount(
                    <ToggleButtonGroup onChange={callback} value='test-one'>
                        <ToggleButton value='test-one'>Test One</ToggleButton>
                        <ToggleButton value='test-two'>Test Two</ToggleButton>
                    </ToggleButtonGroup>
                );

                wrapper.find(ToggleButton).at(0).simulate('click');
                expect(callback.callCount).to.equal(1);
                expect(callback.args[0][1]).to.equal(null);
            });
        });

        describe('multiple choice', () => {
            it('should be called when one of the toggle_buttons is clicked with value of the button', () => {
                const callback = fake();
                const wrapper = mount(
                    <ToggleButtonGroup onChange={callback} multiple>
                        <ToggleButton value='test-one'>Test One</ToggleButton>
                        <ToggleButton value='test-two'>Test Two</ToggleButton>
                    </ToggleButtonGroup>
                );

                wrapper.find(ToggleButton).at(0).simulate('click');
                expect(callback.callCount).to.equal(1);
                expect(callback.args[0][1].length).to.equal(1);
                expect(callback.args[0][1].slice(-1)).to.eql(['test-one']);
            });
            it('should be called when the first ToggleButton is clicked with an empty array', () => {
                const callback = fake();
                const wrapper = mount(
                    <ToggleButtonGroup onChange={callback} value={['test-one']} multiple>
                        <ToggleButton value='test-one'>Test One</ToggleButton>
                        <ToggleButton value='test-two'>Test Two</ToggleButton>
                    </ToggleButtonGroup>
                );

                wrapper.find(ToggleButton).at(0).simulate('click');
                expect(callback.callCount).to.equal(1);
                expect(callback.args[0][1]).to.be.an('array');
                expect(callback.args[0][1].length).to.equal(0);
            });
        });
    });

    describe('Check the button selection', () => {
        it('should select the button Test One in single mode', () => {
            const callback = fake();
            const wrapper = mount(
                <ToggleButtonGroup onChange={callback} value={'test-one'}>
                    <ToggleButton value='test-one'>Test One</ToggleButton>
                    <ToggleButton value='test-two'>Test Two</ToggleButton>
                </ToggleButtonGroup>
            );

            const test_one_button = wrapper.find(ToggleButton).at(0);
            expect(test_one_button.props().value).to.equal('test-one');
            expect(test_one_button.props().is_selected).be.true;
        });

        it('should select the button Test One in multiple mode', () => {
            const callback = fake();
            const wrapper = mount(
                <ToggleButtonGroup onChange={callback} value={['test-two', 'test-one']}>
                    <ToggleButton value='test-one'>Test One</ToggleButton>
                    <ToggleButton value='test-two'>Test Two</ToggleButton>
                </ToggleButtonGroup>
            );

            const button_one = wrapper.find(ToggleButton).at(0);
            expect(button_one.props().value).to.equal('test-one');
            expect(button_one.props().is_selected).be.true;

            const button_two = wrapper.find(ToggleButton).at(1);
            expect(button_two.props().value).to.equal('test-two');
            expect(button_two.props().is_selected).be.true;
        });
    });
});
