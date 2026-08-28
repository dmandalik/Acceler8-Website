/* =========================================================
   Accelr8 Management Consulting — shared behaviour
   1. Mobile navigation toggle
   2. Enquiry form -> pre-filled mailto:
   3. Footer year
   ========================================================= */

(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set immediately: `html.js-tx` is what arms the reveal styles. If this
  // script never runs, nothing is ever hidden.
  if (!REDUCED) document.documentElement.classList.add("js-tx");

  /* ---- 1. Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---- 2. Enquiry form ---- */
  // No backend: build a mailto: link and hand off to the visitor's mail client.
  // To switch to in-page submission, point the handler at a Formspree endpoint
  // (or add Netlify's data-netlify attribute to the <form>) and drop the mailto.
  var RECIPIENT = "iwanttogofast@accelr8iq.com";

  var form = document.getElementById("enquiry-form");
  var note = document.getElementById("form-note");
  var defaultNote = note ? note.textContent : "";

  function setNote(msg, isError) {
    if (!note) return;
    note.textContent = msg;
    note.classList.toggle("is-error", !!isError);
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Read by id — `form.name` collides with HTMLFormElement.name.
      var name = val("ef-name");
      var email = val("ef-email");
      var company = val("ef-company");
      var message = val("ef-message");

      if (!name || !email || !message) {
        setNote("Please add your name, email, and a short note.", true);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setNote("That email address doesn't look right.", true);
        return;
      }

      var subject = "Enquiry — " + (company || name);
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        (company ? "Company: " + company + "\n" : "") +
        "\n" + message + "\n";

      window.location.href =
        "mailto:" + encodeURIComponent(RECIPIENT) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setNote("Opening your email app… if nothing happens, write to " + RECIPIENT + " directly.", false);
      window.setTimeout(function () { setNote(defaultNote, false); }, 8000);
    });
  }

  /* ---- 2b. Hero background video ---- */
  var heroVid = document.querySelector(".hero-media video");
  if (heroVid) {
    if (REDUCED) {
      heroVid.parentNode.removeChild(heroVid);
    } else {
      // A rejected play() does not mean the video is unusable — Safari and
      // data-saver modes defer autoplay until there is an interaction. Retry
      // on the first one rather than discarding the video; a still frame
      // behind the scrim is a perfectly good hero in the meantime.
      var tryPlay = function () {
        var a = heroVid.play();
        if (a && typeof a.catch === "function") a.catch(function () {});
      };
      tryPlay();
      var retry = function () {
        tryPlay();
        ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (e) {
          window.removeEventListener(e, retry);
        });
      };
      ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (e) {
        window.addEventListener(e, retry, { passive: true, once: false });
      });

      // A genuine load failure leaves no frame to show, so drop the element.
      heroVid.addEventListener("error", function () {
        if (heroVid.parentNode) heroVid.parentNode.removeChild(heroVid);
      });
    }
  }

  /* ---- 2c. Newsletter signup ---- */
  // Same no-backend approach as the enquiry form: hand off to the mail client.
  var suForm = document.getElementById("signup-form");
  var suNote = document.getElementById("signup-note");
  if (suForm) {
    var suDefault = suNote ? suNote.textContent : "";
    suForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = val("su-email");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (suNote) { suNote.textContent = "That email address doesn't look right."; suNote.classList.add("is-error"); }
        return;
      }
      window.location.href =
        "mailto:" + encodeURIComponent(RECIPIENT) +
        "?subject=" + encodeURIComponent("Blog subscription") +
        "&body=" + encodeURIComponent("Please add " + email + " to the Accelr8 blog list.\n");
      if (suNote) {
        suNote.classList.remove("is-error");
        suNote.textContent = "Opening your email app\u2026";
        window.setTimeout(function () { suNote.textContent = suDefault; }, 8000);
      }
    });
  }

  /* ---- 3. Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- 4. Scroll reveal ----------------------------------------------- */
  // Reveals inner content, never the <section> — transforming a snap target
  // fights the snap it is aligned to.
  var sections = [].slice.call(document.querySelectorAll("main > section"));

  function markReveals() {
    var SEL = ".sec-head, .hero-inner, .contact-grid > div, " +
              ".ruled-grid > li, .numbered > li, .stages > li, .ruled > li, " +
              ".figures > .figure, .cols > *, .versus > div, " +
              ".table-scroll, .case-body > *";
    sections.forEach(function (sec) {
      var kids = [].slice.call(sec.querySelectorAll(SEL));
      // A nested match (a .card inside a .case) would double-animate.
      kids = kids.filter(function (el) {
        return !kids.some(function (o) { return o !== el && o.contains(el); });
      });
      kids.forEach(function (el, i) {
        el.setAttribute("data-rv", "");
        el.style.setProperty("--rv-d", Math.min(i * 70, 350) + "ms");
      });
    });
  }

  function observeReveals() {
    var targets = document.querySelectorAll("[data-rv]");
    if (!("IntersectionObserver" in window)) {
      // No observer: show everything rather than leave the page blank.
      [].forEach.call(targets, function (el) { el.classList.add("rv-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("rv-in");
          io.unobserve(e.target);   // reveal once; no flicker on scroll-back
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    [].forEach.call(targets, function (el) { io.observe(el); });
  }

  if (!REDUCED && sections.length) {
    markReveals();
    observeReveals();
    // Safety net: if anything is still hidden after load, show it.
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        [].forEach.call(document.querySelectorAll("[data-rv]:not(.rv-in)"), function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("rv-in");
        });
      }, 400);
    });
  }

  /* ---- 5. Scroll progress --------------------------------------------- */
  var bar = document.createElement("div");
  bar.className = "tx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  // Throttled by time rather than requestAnimationFrame: rAF is paused
  // whenever the page is not compositing, and the progress bar and reveals
  // must still track scrolling there.
  var lastRun = 0, trailing = null;

  function runScroll() {
    lastRun = Date.now();
    updateRail();

    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";

    // Floor under the observer: anything scrolled into view is shown, even if
    // its IntersectionObserver entry never fired. Nothing stays hidden.
    var pending = document.querySelectorAll("[data-rv]:not(.rv-in)");
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].getBoundingClientRect().top < window.innerHeight) {
        pending[i].classList.add("rv-in");
      }
    }
  }

  function onScroll() {
    var since = Date.now() - lastRun;
    if (since >= 60) { runScroll(); return; }
    window.clearTimeout(trailing);
    trailing = window.setTimeout(runScroll, 60 - since);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- 6. Section rail ------------------------------------------------ */
  var rail = null, dots = [];

  // Trim to a word boundary so a rail label never breaks mid-word.
  function clip(str, max) {
    max = max || 30;
    if (str.length <= max) return str;
    var cut = str.slice(0, max);
    var sp = cut.lastIndexOf(" ");
    return (sp > 12 ? cut.slice(0, sp) : cut).replace(/[\s,.;:—-]+$/, "") + "\u2026";
  }

  function labelFor(sec, i) {
    var explicit = sec.getAttribute("data-nav-label");
    if (explicit) return explicit;
    var h = sec.querySelector("h1, h2");
    // innerText, not textContent: a <br> between words must read as a space.
    if (h) return clip((h.innerText || h.textContent).trim().replace(/\s+/g, " "));
    var e = sec.querySelector(".eyebrow");
    return e ? e.textContent.trim() : "Section " + (i + 1);
  }

  if (sections.length > 1) {
    rail = document.createElement("ul");
    rail.className = "tx-rail";
    rail.setAttribute("aria-label", "Sections");

    sections.forEach(function (sec, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-label", labelFor(sec, i));
      b.setAttribute("aria-label", "Go to " + labelFor(sec, i));
      // Dots over dark bands need a light outline to stay visible.
      if (sec.classList.contains("band-night") || sec.classList.contains("hero")) {
        b.className = "on-dark";
      }
      b.addEventListener("click", function () { goTo(i); });
      li.appendChild(b);
      rail.appendChild(li);
      dots.push(b);
    });
    document.body.appendChild(rail);
  }

  onScroll();   // first paint of progress bar + active dot

  // Active dot is derived from scroll position rather than an observer:
  // deterministic, and it still updates when frames are not being served.
  function updateRail() {
    if (!dots || !dots.length) return;   // may run before the rail is built
    var i = currentIndex();
    for (var j = 0; j < dots.length; j++) {
      dots[j].setAttribute("aria-current", j === i ? "true" : "false");
    }
  }

  /* ---- 6b. In-page anchors -------------------------------------------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href");
    if (!id || id === "#") return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    navTarget = null;
    scrollWithSnapSuspended(el.getBoundingClientRect().top + window.scrollY - headerOffset());
    if (history.replaceState) history.replaceState(null, "", id);
  });

  /* ---- 7. Keyboard paging --------------------------------------------- */
  function currentIndex() {
    var mid = window.scrollY + window.innerHeight / 2, best = 0;
    sections.forEach(function (sec, i) {
      var t = sec.offsetTop, b = t + sec.offsetHeight;
      if (mid >= t && mid < b) best = i;
    });
    return best;
  }

  // Remembers where paging is headed. Without this, pressing PageDown three
  // times quickly recomputes the index from a mid-animation scroll position
  // each time and all three presses collapse onto one section.
  var navTarget = null;

  var snapTimer = null, animId = null;

  // Scroll animation, done here rather than with `behavior: "smooth"`.
  // scroll-snap cancels native smooth scrolling outright — the animation is
  // interrupted and the page returns to its snap point, so it never moves.
  function animateTo(top, done) {
    var de = document.documentElement;
    var max = de.scrollHeight - window.innerHeight;
    top = Math.max(0, Math.min(top, max));

    if (REDUCED) { window.scrollTo(0, top); if (done) done(); return; }

    window.cancelAnimationFrame(animId);
    var start = window.scrollY, delta = top - start, t0 = null, started = false;
    var dur = Math.min(760, Math.max(300, Math.abs(delta) * 0.42));

    function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

    function step(ts) {
      started = true;
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      window.scrollTo(0, start + delta * ease(p));
      if (p < 1) animId = window.requestAnimationFrame(step);
      else if (done) done();
    }
    animId = window.requestAnimationFrame(step);

    // requestAnimationFrame is paused whenever the page is not compositing —
    // a background tab, a hidden panel, some embedded webviews. Navigation must
    // still work there, so if no frame has arrived shortly, jump outright.
    window.setTimeout(function () {
      if (started) return;
      window.cancelAnimationFrame(animId);
      window.scrollTo(0, top);
      if (done) done();
    }, 150);
  }

  // Scroll to a document position with snapping suspended for the duration.
  // The restore is scheduled unconditionally as well as on completion: if
  // frames stop arriving mid-animation the completion callback never runs, and
  // snapping would otherwise stay switched off for the rest of the session.
  function scrollWithSnapSuspended(top) {
    var de = document.documentElement;
    function restore() { de.style.scrollSnapType = ""; }

    de.style.scrollSnapType = "none";
    window.clearTimeout(snapTimer);

    animateTo(top, function () {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(restore, 60);
    });

    // Backstop, independent of the animation ever finishing.
    snapTimer = window.setTimeout(restore, 1100);
  }

  function headerOffset() {
    var v = parseInt(getComputedStyle(document.documentElement)
              .getPropertyValue("--header-h"), 10);
    return isNaN(v) ? 78 : v;
  }

  function goTo(i) {
    if (i < 0 || i >= sections.length) return;
    navTarget = i;

    // Snapping is suspended while the animation runs, then restored so normal
    // wheel scrolling still settles on section boundaries.
    scrollWithSnapSuspended(
      sections[i].getBoundingClientRect().top + window.scrollY - headerOffset()
    );
    updateRail();
  }

  // Any manual scroll hands control back to the measured position.
  ["wheel", "touchmove", "mousedown"].forEach(function (evt) {
    window.addEventListener(evt, function () { navTarget = null; }, { passive: true });
  });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;

    // Never hijack typing, or a menu the user has open.
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" ||
              t.tagName === "SELECT" || t.isContentEditable)) return;
    if (nav && nav.classList.contains("open")) return;
    if (!sections.length) return;

    var base = (navTarget === null) ? currentIndex() : navTarget;

    switch (e.key) {
      case "PageDown": goTo(base + 1); break;
      case "PageUp":   goTo(base - 1); break;
      case "Home":     goTo(0); break;
      case "End":      goTo(sections.length - 1); break;
      default: return;   // arrow keys stay as normal free scrolling
    }
    e.preventDefault();
  });
})();
