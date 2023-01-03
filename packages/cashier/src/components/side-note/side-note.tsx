import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TReactChildren, TSideNotesProps } from 'Types';
import './side-note.scss';

type TSideNoteTitle = {
    children_length?: number;
    side_notes_length?: number;
    title?: string | JSX.Element;
};

type TSideNoteBullet = {
    children: TReactChildren;
    id: number;
};

type TSideNoteProps = React.PropsWithChildren<{
    className?: string;
    has_bullets?: boolean;
    has_title?: boolean;
    is_mobile?: boolean;
    side_notes?: TSideNotesProps;
    title?: string | JSX.Element;
}>;

const SideNoteTitle = ({ children_length, side_notes_length, title }: TSideNoteTitle) => {
    const length_of_notes = children_length || side_notes_length || 0;

    return (
        <Text className='side-note__title' weight='bold' as='p'>
            {title ||
                (length_of_notes > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
        </Text>
    );
};

const SideNoteBullet = ({ children, id }: TSideNoteBullet) => (
    <div className='side-note__bullet-wrapper' data-testid={`dt_side_note_bullet_wrapper_${id}`}>
        <div className='side-note__bullet' data-testid={`dt_side_note_bullet_${id}`} />
        <div>{children}</div>
    </div>
);

const SideNote = ({
    children,
    className,
    has_bullets = true,
    has_title = true,
    is_mobile,
    side_notes,
    title,
}: TSideNoteProps) => {
    const Wrapper = is_mobile ? MobileWrapper : DesktopWrapper;

    return (
        <>
            {(children || side_notes?.length) && (
                <Wrapper>
                    <div className={classNames('side-note', { 'side-note--mobile': isMobile() }, className)}>
                        {has_title && (
                            <SideNoteTitle
                                title={title}
                                children_length={Array.isArray(children) ? children?.length : 1}
                                side_notes_length={side_notes?.length}
                            />
                        )}

                        {children && <>{children}</>}

                        {!children &&
                            side_notes?.map((note, i) =>
                                has_bullets ? (
                                    <SideNoteBullet id={i} key={i}>
                                        {note}
                                    </SideNoteBullet>
                                ) : (
                                    <Text key={i} className='side-note__text' size='xxs' as='p'>
                                        {note}
                                    </Text>
                                )
                            )}
                    </div>
                </Wrapper>
            )}
        </>
    );
};

export default SideNote;
