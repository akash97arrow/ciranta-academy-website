document.addEventListener("DOMContentLoaded", () => {

    // Check whether the current page is inside the pages folder
    const isPagesFolder = window.location.pathname.includes("/pages/");
    const rootPath = isPagesFolder ? "../" : "";

    /* =========================================
       LOAD HEADER
    ========================================= */

    const headerContainer = document.querySelector("#header");

    if (headerContainer) {

        fetch(`${rootPath}components/header.html`)
            .then(response => response.text())
            .then(data => {

                headerContainer.innerHTML = data;

                setupHeaderNavigation(rootPath);

            })
            .catch(error => {
                console.error("Error loading header:", error);
            });
    }


    /* =========================================
       LOAD FOOTER
    ========================================= */

    const footerContainer = document.querySelector("#footer");

    if (footerContainer) {

        fetch(`${rootPath}components/footer.html`)
            .then(response => response.text())
            .then(data => {

                footerContainer.innerHTML = data;

                setupFooterNavigation(rootPath);

            })
            .catch(error => {
                console.error("Error loading footer:", error);
            });
    }


    /* =========================================
       HEADER NAVIGATION
    ========================================= */

    function setupHeaderNavigation(rootPath) {

        const header = document.querySelector(".site-header");

        if (!header) return;


        /* -----------------------------------------
           Fix navigation links
        ----------------------------------------- */

        const navLinks = header.querySelectorAll(".main-nav a");

        navLinks.forEach(link => {

            const page = link.getAttribute("href");

            if (page === "index.html") {

                link.href = `${rootPath}index.html`;

            } else if (page.startsWith("pages/")) {

                link.href = `${rootPath}${page}`;

            }

        });


        /* -----------------------------------------
           Fix CTA link
        ----------------------------------------- */

        const navButton = header.querySelector(".nav-button");

        if (navButton) {
            navButton.href = `${rootPath}pages/programmes.html`;
        }


        /* -----------------------------------------
           Fix brand link
        ----------------------------------------- */

        const brand = header.querySelector(".brand");

        if (brand) {
            brand.href = `${rootPath}index.html`;
        }


        /* -----------------------------------------
           Active navigation item
        ----------------------------------------- */

        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        navLinks.forEach(link => {

            const linkPage =
                link.getAttribute("href").split("/").pop();

            if (linkPage === currentPage) {
                link.classList.add("active");
            }

        });


        /* -----------------------------------------
           Mobile menu
        ----------------------------------------- */

        const menuButton = header.querySelector(".menu-button");
        const mainNav = header.querySelector(".main-nav");

        if (menuButton && mainNav) {

            menuButton.addEventListener("click", () => {

                const isOpen =
                    mainNav.classList.toggle("menu-open");

                menuButton.setAttribute(
                    "aria-expanded",
                    isOpen
                );

                menuButton.setAttribute(
                    "aria-label",
                    isOpen ? "Close menu" : "Open menu"
                );

            });

        }

    }


    /* =========================================
       FOOTER NAVIGATION
    ========================================= */

    function setupFooterNavigation(rootPath) {

        const footer = document.querySelector(".site-footer");

        if (!footer) return;

        const footerLinks = footer.querySelectorAll("a");

        footerLinks.forEach(link => {

            const href = link.getAttribute("href");

            if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
                return;
            }

            if (href === "index.html") {

                link.href = `${rootPath}index.html`;

            } else if (href.startsWith("pages/")) {

                link.href = `${rootPath}${href}`;

            }

        });

    }

});