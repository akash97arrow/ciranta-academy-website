document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form-card form");
    const status = document.querySelector("#contact-form-status");

    if (!form || !status) return;

    const submitButton = form.querySelector(".contact-submit");

    const showStatus = (message, state) => {
        status.textContent = message;
        status.dataset.state = state;
        status.hidden = false;
    };

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!form.reportValidity() || submitButton.disabled) return;

        submitButton.disabled = true;
        form.setAttribute("aria-busy", "true");
        showStatus("Sending your message...", "pending");

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });

            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error("The contact service returned an unexpected response.");
            }

            if (!response.ok || result.success !== true) {
                showStatus(
                    result.message || "We could not send your message. Please try again.",
                    "error"
                );

                const firstInvalidField = Object.keys(result.errors || {})[0];
                if (firstInvalidField) {
                    form.elements.namedItem(firstInvalidField)?.focus();
                }
                return;
            }

            form.reset();
            showStatus(result.message, "success");
        } catch {
            showStatus(
                "We could not reach the contact service. Your entries are still here; please try again later.",
                "error"
            );
        } finally {
            submitButton.disabled = false;
            form.removeAttribute("aria-busy");
        }
    });
});