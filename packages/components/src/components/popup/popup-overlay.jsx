import * as React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Text from '../text/text';
import Button from '../button/button';

const PopupOverlay = ({ title, descriptions, overlay_ref, toggleOverlay, done_text }) =>
    createPortal(
        <div className='dc-popup__overlay-content'>
            <Text
                as='h4'
                size='s'
                line_height='m'
                color='prominent'
                weight='bold'
                className='dc-popup__overlay-content-header'
            >
                {title}
            </Text>
            <div className='dc-popup__overlay-content-separator' />
            <ul className='dc-popup__overlay-content-list'>
                {descriptions.map(description => (
                    <li key={description.key}>
                        <Text size='xxs' line_height='m' color='general'>
                            {description.component}
                        </Text>
                    </li>
                ))}
            </ul>
            <Button
                className='dc-popup__overlay-content-button'
                secondary
                large
                onClick={toggleOverlay}
                text={done_text}
            />
        </div>,
        overlay_ref
    );

PopupOverlay.propTypes = {
    descriptions: PropTypes.array.isRequired,
    done_text: PropTypes.string.isRequired,
    overlay_ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]).isRequired,
    title: PropTypes.string.isRequired,
    toggleOverlay: PropTypes.func.isRequired,
};

export default PopupOverlay;
