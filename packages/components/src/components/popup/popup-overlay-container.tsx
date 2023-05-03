import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import PopupContext from './popup-context';

type TPopupOverlayContainer = {
    refSetter: (instance: HTMLDivElement | null) => void;
};

const PopupOverlayContainer = ({ refSetter }: TPopupOverlayContainer) => {
    const { is_overlay_shown } = React.useContext(PopupContext);

    return (
        <CSSTransition
            in={is_overlay_shown}
            appear
            timeout={250}
            classNames={{
                appear: 'dc-popup__overlay--appear',
                enter: 'dc-popup__overlay--enter',
                enterDone: 'dc-popup__overlay--enter-done',
                exit: 'dc-popup__overlay--exit',
            }}
        >
            <div className='dc-popup__overlay' ref={refSetter} />
        </CSSTransition>
    );
};

export default PopupOverlayContainer;
