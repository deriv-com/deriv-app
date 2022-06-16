import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import './side-note.scss';

const SideNoteTitle = ({ side_notes, title }) => (
    <Text className='side-note__title' weight='bold' as='p'>
        {title ||
            (side_notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
    </Text>
);

const SideNoteBullet = ({ children }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        <div>{children}</div>
    </div>
);

const SideNoteText = ({ children, has_bullets, is_component }) => {
    if (is_component) {
        return has_bullets ? <SideNoteBullet>{children}</SideNoteBullet> : children;
    }
    if (has_bullets) {
        return (
            <SideNoteBullet>
                <Text className='side-note__text' size='xxs' as='p'>
                    {children}
                </Text>
            </SideNoteBullet>
        );
    }
    return (
        <Text className='side-note__text' size='xxs' as='p'>
            {children}
        </Text>
    );
};

const SideNote = ({ children, side_notes, title, has_bullets = true, is_mobile, className }) => {
    const notes = (note, i) => {
        let component;
        if (typeof note === 'string') {
            <SideNoteText key={note.key || i} has_bullets={has_bullets}>
                {note}
            </SideNoteText>;
        } else if (typeof note === 'object' && note.props.i18n_default_text) {
            component = { ...note };
            component.key = i;
            return (
                <SideNoteText has_bullets={has_bullets} is_component>
                    {component}
                </SideNoteText>
            );
        }

        component = { ...note };
        component.key = i;
        return component;
    };

    if (children) {
        return (
            <>
                {is_mobile && <MobileWrapper>{children}</MobileWrapper>}
                {!is_mobile && <DesktopWrapper>{children}</DesktopWrapper>}
            </>
        );
    }

    return (
        <>
            {side_notes?.length && (
                <div className={classNames('side-note', { 'side-note--mobile': isMobile() }, className)}>
                    <DesktopWrapper>
                        <SideNoteTitle side_notes={side_notes} title={title} />
                    </DesktopWrapper>

                    {side_notes.map((note, i) => (
                        <div key={i} className={classNames('side-note__item')}>
                            {notes(note, i)}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

SideNote.propTypes = {
    children: PropTypes.any,
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
