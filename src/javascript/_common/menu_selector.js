const MenuSelector = (() => {
    let array_sections,
        go_back,
        go_next;

    const init = (sections, show_div = true) => {
        array_sections = sections;
        go_back        = document.getElementById('go_back');
        go_next        = document.getElementById('go_next');

        const $sidebar_list_item = $('#sidebar-nav li');
        $sidebar_list_item.click(function () {
            $sidebar_list_item.removeClass('selected');
            $(this).addClass('selected');
        });

        $(window).on('hashchange', showSelectedDiv);
        if (show_div) {
            showSelectedDiv();
        }
    };

    const getHash = () => {
        const hash = window.location.hash;
        return hash && $.inArray(hash.substring(1), array_sections) !== -1 ? hash : `#${array_sections[0]}`;
    };

    const showSelectedDiv = () => {
        const $sections_with_hash = $(`.sections[id="${getHash().substring(1)}"]`);
        if ($sections_with_hash.is(':visible') && $('.sections:visible').length === 1) {
            return;
        }
        $('.sections').setVisibility(0);
        $sections_with_hash.setVisibility(1);
        $(`#sidebar-nav a[href="${getHash()}"]`).parent().addClass('selected');

        if (go_back && go_next) {
            initBackNextButtons();
        }
    };

    const initBackNextButtons = () => {
        const current_section = getHash().slice(1);
        const current_index   = array_sections.indexOf(current_section);
        if (current_index === 0) {
            go_back.classList.add('button-disabled');
        } else {
            go_back.classList.remove('button-disabled');
            go_back.setAttribute('href', `#${array_sections[current_index - 1]}`);
        }
        if (current_index === array_sections.length - 1) {
            go_next.classList.add('button-disabled');
        } else {
            go_next.classList.remove('button-disabled');
            go_next.setAttribute('href', `#${array_sections[current_index + 1]}`);
        }
    };

    const clean = () => {
        $(window).off('hashchange', showSelectedDiv);
    };

    return {
        init,
        clean,
    };
})();

module.exports = MenuSelector;
