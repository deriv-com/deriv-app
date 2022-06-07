import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import 'Sass/side-note.scss';

const SideNoteTitle = ({ side_notes, title }) => (
    <Text className='side-note__title' weight='bold' as='p'>
        {title ||
            (side_notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
    </Text>
);

const SideNoteText = ({ children }) => (
    <Text className='side-note__text' size='xxs' as='p'>
        {children}
    </Text>
);

const SideNoteBullet = ({ children, is_component }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        {is_component ? children : <SideNoteText>{children}</SideNoteText>}
    </div>
);

const SideNote = ({ side_notes, title, has_bullets = true, className }) => {
    const notes = (note, i) => {
        let component;
        if (typeof note === 'string') {
            if (has_bullets)
                return (
                    <SideNoteBullet key={i}>
                        <SideNoteText key={note.key || i}>{note}</SideNoteText>
                    </SideNoteBullet>
                );
            return <SideNoteText key={note.key || i}>{note}</SideNoteText>;
        } else if (typeof note === 'object' && note.props.i18n_default_text) {
            component = { ...note };
            if (has_bullets)
                return (
                    <SideNoteBullet key={i} is_component>
                        <SideNoteText>{component}</SideNoteText>
                    </SideNoteBullet>
                );
            component.key = i;
            return component;
        }

        component = { ...note };
        component.key = i;
        return component;
    };

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
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
