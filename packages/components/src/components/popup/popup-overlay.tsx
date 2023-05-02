import * as React from 'react';
import { createPortal } from 'react-dom';
import Text from '../text/text';
import Button from '../button/button';

type TPopupOverlay = {
    title: string;
    descriptions: {
        key: number | string;
        component: React.ReactNode;
    }[];
    overlay_ref: HTMLDivElement;
    toggleOverlay?: () => void;
    done_text: string;
};

const PopupOverlay = ({ title, descriptions, overlay_ref, toggleOverlay, done_text }: TPopupOverlay) =>
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

export default PopupOverlay;
