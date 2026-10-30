/* =========================================================
   Clara Monteiro · Interações
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WHATSAPP = "5511999999999";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => $("#preloader")?.classList.add("is-done"), 900);
  });

  /* ---------- Ano no rodapé ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Header ao rolar ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  const toggleMenu = (open) => {
    const isOpen = open ?? !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", isOpen);
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleMenu());
  $$("a", nav).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Link ativo conforme seção ---------- */
  const links = $$(".nav__link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  // atraso escalonado entre irmãos
  $$(".reveal").forEach((el) => {
    const siblings = $$(":scope > .reveal", el.parentElement);
    const i = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Contadores ---------- */
  const formatNum = (n) => n.toLocaleString("pt-BR");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1800;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = formatNum(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ---------- Tabs de serviços ---------- */
  const tabs = $$(".tab");
  const indicator = $(".tabs__indicator");
  const moveIndicator = (tab) => {
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  };
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab);
      });
      $$(".tab-panel").forEach((p) => {
        const active = p.dataset.panel === tab.dataset.tab;
        p.hidden = !active;
        p.classList.toggle("is-active", active);
      });
      moveIndicator(tab);
    })
  );
  const initIndicator = () => moveIndicator($(".tab.is-active"));
  initIndicator();
  window.addEventListener("resize", initIndicator);
  document.fonts?.ready.then(initIndicator);

  /* ---------- Antes / Depois ---------- */
  const compare = $("#compare");
  const range = $("#compare-range");
  const setPos = (v) => compare.style.setProperty("--pos", `${v}%`);
  range.addEventListener("input", (e) => setPos(e.target.value));
  // pequena animação de "dica" quando aparece
  const hintObserver = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      hintObserver.disconnect();
      let t = 0;
      const anim = () => {
        t += 0.03;
        const v = 50 + Math.sin(t * 2) * 18 * Math.max(0, 1 - t / 3.2);
        setPos(v);
        range.value = v;
        if (t < 3.2) requestAnimationFrame(anim);
      };
      setTimeout(() => requestAnimationFrame(anim), 600);
    },
    { threshold: 0.5 }
  );
  hintObserver.observe(compare);

  /* ---------- Slider de depoimentos ---------- */
  const slider = $("#testimonial-slider");
  const track = $(".slider__track", slider);
  const slides = $$(".testimonial", track);
  const dotsWrap = $("#slider-dots");
  let current = 0;
  let autoplay;

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
    b.addEventListener("click", () => go(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = $$("button", dotsWrap);

  function go(i, user = false) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle("is-active", j === current));
    if (user) restart();
  }
  const restart = () => {
    clearInterval(autoplay);
    autoplay = setInterval(() => go(current + 1), 6500);
  };
  $("#slider-prev").addEventListener("click", () => go(current - 1, true));
  $("#slider-next").addEventListener("click", () => go(current + 1, true));

  // swipe
  let startX = null;
  track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1), true);
    startX = null;
  });
  go(0);
  restart();

  /* ---------- Pacotes pré-selecionam o formulário ---------- */
  const servico = $("#f-servico");
  $$("[data-plan]").forEach((btn) =>
    btn.addEventListener("click", () => {
      servico.value = `Pacote ${btn.dataset.plan}`;
    })
  );

  /* ---------- Máscara de telefone ---------- */
  const tel = $("#f-tel");
  tel.addEventListener("input", () => {
    let v = tel.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    tel.value = v;
  });

  /* ---------- Data mínima = hoje ---------- */
  const data = $("#f-data");
  data.min = new Date().toISOString().split("T")[0];

  /* ---------- Envio do agendamento via WhatsApp ---------- */
  const form = $("#booking-form");
  const feedback = $("#form-feedback");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    ["#f-nome", "#f-tel", "#f-servico"].forEach((id) => {
      const el = $(id);
      const invalid = !el.value || (id === "#f-tel" && el.value.replace(/\D/g, "").length < 10);
      el.closest(".field").classList.toggle("is-invalid", invalid);
      if (invalid) ok = false;
    });
    if (!ok) {
      feedback.textContent = "Por favor, preencha nome, WhatsApp e tratamento. 🌿";
      return;
    }
    const f = new FormData(form);
    const dataFmt = f.get("data") ? new Date(f.get("data") + "T12:00").toLocaleDateString("pt-BR") : "a combinar";
    const msg =
      `Olá, Clara! 🌿\n\n` +
      `Meu nome é *${f.get("nome")}* e gostaria de agendar:\n` +
      `• Tratamento: ${f.get("servico")}\n` +
      `• Data preferida: ${dataFmt}\n` +
      `• Período: ${f.get("periodo")}\n` +
      (f.get("mensagem") ? `• Sobre minha pele: ${f.get("mensagem")}\n` : "") +
      `\nMeu contato: ${f.get("telefone")}`;
    feedback.textContent = "Abrindo o WhatsApp… obrigada! 🤍";
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  /* ---------- Newsletter ---------- */
  $("#news-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#news-email");
    input.value = "";
    input.placeholder = "Inscrição confirmada! 🤍";
  });

  /* ---------- Cursor decorativo ---------- */
  const cursor = $("#cursor");
  if (window.matchMedia("(hover: hover)").matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add("is-visible");
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$("a, button, .card, .insta__item, summary, .compare").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- Parallax sutil no hero ---------- */
  const heroImg = $(".hero__arch img");
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.translate = `0 ${y * 0.08}px`;
    },
    { passive: true }
  );
})();
