import React             from 'react';
import { render }        from '@testing-library/react';
import                   '@testing-library/jest-dom/extend-expect'
import { CSSTransition } from 'react-transition-group';
import Modal             from '../modal.jsx';

describe('Modal', () => {
    it('renders without crashing' , () => {
        render(<Modal/>)
    })
    // it('<Modal /> should have CSSTransition', () => {
    //     const wrapper = React.createRef();
    //     render(<Modal ref={wrapper} />);
    //     expect(wrapper.find(CSSTransition).exists()).to.be.true;
    // });
    // it('<Modal /> should have ModalElement', () => {
    //     const wrapper = React.createRef();
    //     render(<Modal ref={wrapper} />);
    //     expect(wrapper.find(CSSTransition).shallow().find(ModalElement).exists()).to.be.true;
    // });
});
