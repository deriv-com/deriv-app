import { expect }        from 'chai';
import { shallow }       from 'enzyme/build';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import {
    Modal,
    ModalElement }       from '../modal.jsx';

describe('Modal', () => {
    it('<Modal /> should have CSSTransition', () => {
        const wrapper = shallow(<Modal />);
        expect(wrapper.find(CSSTransition).exists()).to.be.true;
    });
    it('<Modal /> should have ModalElement', () => {
        const wrapper = shallow(<Modal />);
        expect(wrapper.find(CSSTransition).shallow().find(ModalElement).exists()).to.be.true;
    });
});
