// Handler when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    toggleMobileMenu();

    const navbar = document.getElementsByClassName('navbar')[0];
    // Scroll to section
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-scroll')) {
            const target = e.target.getAttribute('href').substr(1);
            const offset = target === 'page-top' ? 55 : 0;
            const navbarHeight = checkWidth();
            const el_target = document.getElementById(target);
            const to = el_target ? el_target.offsetTop - navbarHeight - offset : '';
            scrollTo(to, 500);
            if (navbar.classList.contains('expand')) {
                navbar.classList.remove('expand');
            }
            e.preventDefault();
        }
    });

    window.onresize = checkWidth;

    commonOnload();
});
