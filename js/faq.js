document.addEventListener("DOMContentLoaded", () => {

    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const currentItem = button.closest(".faq-item");
            const isOpen = currentItem.classList.contains("open");

            // Close all FAQ items
            document.querySelectorAll(".faq-item").forEach((item) => {

                item.classList.remove("open");

                const question = item.querySelector(".faq-question");

                if (question) {
                    question.setAttribute("aria-expanded", "false");
                }

            });

            // Open the clicked item if it was previously closed
            if (!isOpen) {

                currentItem.classList.add("open");

                button.setAttribute("aria-expanded", "true");

            }

        });

    });

});