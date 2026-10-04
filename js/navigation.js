document.addEventListener("DOMContentLoaded", () => {

    const isNestedPage = /\/(pages|articles|programmes)\//.test(window.location.pathname);
    const rootPath = isNestedPage ? "../" : "";

    const headerContainer = document.querySelector("#header");

    if (headerContainer) {
        fetch(`${rootPath}components/header.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Header request failed: ${response.status}`);
                }

                return response.text();
            })
            .then(data => {

                headerContainer.innerHTML = data;

                // =========================================
                // FIX HEADER LOGO PATH
                // =========================================
                // Header is used on both root and nested pages.
                // Make sure the logo always loads from the
                // website root.
                const headerLogo = headerContainer.querySelector(".nav-logo");

                if (headerLogo) {
                    headerLogo.src = `${rootPath}images/header/header-logo.png`;
                }

                setupHeaderNavigation(rootPath);
            })
            .catch(error => {
                console.error("Error loading header:", error);
            });
    }


    const footerContainer = document.querySelector("#footer");

    if (footerContainer) {
        fetch(`${rootPath}components/footer.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Footer request failed: ${response.status}`);
                }

                return response.text();
            })
            .then(data => {

                footerContainer.innerHTML = data;

                // =========================================
                // FIX FOOTER LOGO PATH
                // =========================================
                // Make sure the footer logo works on
                // root pages and nested pages.
                const footerLogo = footerContainer.querySelector(".footer-logo");

                if (footerLogo) {
                    footerLogo.src = `${rootPath}images/footer/footer-logo.png`;
                }

                setupFooterNavigation(rootPath);
            })
            .catch(error => {
                console.error("Error loading footer:", error);
            });
    }


    // =========================================
    // HEADER NAVIGATION
    // =========================================

    function setupHeaderNavigation(rootPath) {

        const header = document.querySelector(".site-header");

        if (!header || header.dataset.navigationReady === "true") {
            return;
        }

        header.dataset.navigationReady = "true";


        // =========================================
        // FIX NAVIGATION LINKS
        // =========================================

        const navLinks = header.querySelectorAll(".main-nav a");

        navLinks.forEach(link => {

            const page = link.getAttribute("href");

            if (page === "index.html") {

                link.href = `${rootPath}index.html`;

            } else if (page && page.startsWith("pages/")) {

                link.href = `${rootPath}${page}`;
            }
        });


        // =========================================
        // FIX LOGO / BRAND LINK
        // =========================================

        const brand = header.querySelector(".navbar-brand, .brand");

        if (brand) {
            brand.href = `${rootPath}index.html`;
        }


        // =========================================
        // ACTIVE NAVIGATION LINK
        // =========================================

        const pathSegments = window.location.pathname
            .split("/")
            .filter(Boolean);

        const currentFile =
            pathSegments[pathSegments.length - 1] || "index.html";

        const parentFolder =
            pathSegments[pathSegments.length - 2];


        const currentPage =
            parentFolder === "programmes"
                ? "programmes.html"
                : parentFolder === "articles"
                    ? "journal.html"
                    : currentFile;


        navLinks.forEach(link => {

            const linkPage = link.href.split("/").pop();

            if (linkPage === currentPage) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.classList.remove("active");

                link.removeAttribute("aria-current");
            }
        });


        // =========================================
        // MOBILE MENU
        // =========================================

        const menuButton =
            header.querySelector(".menu-button");

        const mainNav =
            header.querySelector(".main-nav");

        const mobileBreakpoint =
            window.matchMedia("(max-width: 851px)");


        if (menuButton && mainNav) {

            const isMenuOpen = () => {
                return mainNav.classList.contains("menu-open");
            };


            const setMenuOpen = (
                open,
                restoreFocus = false
            ) => {

                const shouldOpen =
                    open && mobileBreakpoint.matches;


                mainNav.classList.toggle(
                    "menu-open",
                    shouldOpen
                );


                menuButton.setAttribute(
                    "aria-expanded",
                    String(shouldOpen)
                );


                menuButton.setAttribute(
                    "aria-label",
                    shouldOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                );


                if (
                    !shouldOpen &&
                    restoreFocus &&
                    mobileBreakpoint.matches
                ) {

                    menuButton.focus();
                }
            };


            // =========================================
            // OPEN / CLOSE MENU
            // =========================================

            menuButton.addEventListener(
                "click",
                () => {

                    setMenuOpen(
                        !isMenuOpen()
                    );
                }
            );


            // =========================================
            // CLOSE MENU AFTER CLICKING LINK
            // =========================================

            mainNav.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest("a")
                    ) {

                        setMenuOpen(false);
                    }
                }
            );


            // =========================================
            // CLOSE MENU WHEN CLICKING OUTSIDE
            // =========================================

            document.addEventListener(
                "click",
                event => {

                    if (
                        isMenuOpen() &&
                        !mainNav.contains(event.target) &&
                        !menuButton.contains(event.target)
                    ) {

                        setMenuOpen(false);
                    }
                }
            );


            // =========================================
            // CLOSE MENU WITH ESCAPE
            // =========================================

            document.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Escape" &&
                        isMenuOpen()
                    ) {

                        setMenuOpen(
                            false,
                            true
                        );
                    }
                }
            );


            // =========================================
            // HANDLE WINDOW RESIZE
            // =========================================

            window.addEventListener(
                "resize",
                () => {

                    if (
                        !mobileBreakpoint.matches &&
                        isMenuOpen()
                    ) {

                        setMenuOpen(false);
                    }
                }
            );
        }
    }


    // =========================================
    // FOOTER NAVIGATION
    // =========================================

    function setupFooterNavigation(rootPath) {

        const footer =
            document.querySelector(".site-footer");

        if (!footer) {
            return;
        }


        const footerLinks =
            footer.querySelectorAll("a");


        footerLinks.forEach(link => {

            const href =
                link.getAttribute("href");


            // Ignore anchors and email links
            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:")
            ) {

                return;
            }


            if (href === "index.html") {

                link.href =
                    `${rootPath}index.html`;

            } else if (
                href.startsWith("pages/")
            ) {

                link.href =
                    `${rootPath}${href}`;
            }
        });
    }

});