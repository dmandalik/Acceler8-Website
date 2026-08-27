/* =========================================================
   Accelr8 Consulting — front-end behaviour
   1. Mobile navigation toggle
   2. Contact form -> pre-filled mailto: to all three founders
   3. Footer year
   ========================================================= */

(function () {
  "use strict";

  /* ---- 1. Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after a link is tapped (mobile only).
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---- 2. Contact form ---- */
  // No backend: build a mailto: link and hand off to the visitor's mail client.
  // To switch to an in-page submission later, point RECIPIENTS at a Formspree
  // endpoint (or add Netlify's data-netlify attribute) and replace the handler.
  var RECIPIENT = "ksarwal3@gatech.edu";
  var CC = ["sganjoo@iu.edu", "dhruvm2310@gmail.com"];

  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");
  var defaultNote = note ? note.textContent : "";

  function setNote(msg, isError) {
    if (!note) return;
    note.textContent = msg;
    note.classList.toggle("is-error", !!isError);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Read by id — `form.name` collides with HTMLFormElement.name.
      var name = document.getElementById("cf-name").value.trim();
      var email = document.getElementById("cf-email").value.trim();
      var company = document.getElementById("cf-company").value.trim();
      var message = document.getElementById("cf-message").value.trim();

      if (!name || !email || !message) {
        setNote("Please add your name, email, and a short description.", true);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setNote("That email address doesn't look right.", true);
        return;
      }

      var subject = "Automation enquiry — " + (company || name);
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        (company ? "Company: " + company + "\n" : "") +
        "\nWhich process repeats?\n" + message + "\n";

      var url =
        "mailto:" + encodeURIComponent(RECIPIENT) +
        "?cc=" + encodeURIComponent(CC.join(",")) +
        "&subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = url;
      setNote("Opening your email app… if nothing happens, email " + RECIPIENT + " directly.", false);
      window.setTimeout(function () { setNote(defaultNote, false); }, 8000);
    });
  }

  /* ---- 3. Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
