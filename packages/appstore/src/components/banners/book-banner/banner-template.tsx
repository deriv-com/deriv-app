import React from 'react';
import { getAllowedLanguages, Localize } from '@deriv/translations';
import { LabelPairedCircleChevronDownXlBoldIcon, LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { TEbooksUrl } from 'Components/banners/book-banner/book-banner';
import { SessionStore } from '@deriv/shared';

type TBookBannerTemplate = {
    id: 'e-book-banner';
    e_books_url: TEbooksUrl;
    e_book: keyof TEbooksUrl;
    lang: ReturnType<typeof getAllowedLanguages>;
};
const onCancel = () => {
    SessionStore.remove('show_book');
    document.getElementById('e-book-banner')?.classList.add('hidden');
};

const BookBannerTemplate = ({ id, e_books_url, e_book, lang }: TBookBannerTemplate) => {
    return (
        <div id={id} className='book-banner-template'>
            <div className='book-banner-template__left'>
                <LabelPairedCircleChevronDownXlBoldIcon width='24' height='24' fill='#00822A' />
                <div className='book-banner-template__content'>
                    <label>
                        <Localize
                            i18n_default_text={'Your e-book has been emailed to you and is ready for download.'}
                        />
                    </label>
                    <a
                        href={e_books_url[e_book][lang] || e_books_url[e_book].EN}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Localize i18n_default_text={'Download e-book'} />
                    </a>
                </div>
            </div>
            <LabelPairedXmarkLgBoldIcon
                className='book-banner-template__cancel'
                width='24'
                height='24'
                onClick={onCancel}
            />
        </div>
    );
};

export default BookBannerTemplate;
