const state = {
  currentId: null,
  currentSlide: 0,
  touchStartX: 0,
  touchDeltaX: 0,
  pointerActive: false,
  projects: [
    {
      id: 3,
      title: "Third Booklet",
      meta: "2025 · Booklet",
      desc: "The third booklet used both photos and typography, so I focused on making the visual impact stronger. The topic was a solopreneur who does everything alone and is very busy. In typography, I used design elements more actively than before. I increased typographic scale, adjusted weight, kerning, and leading to create rhythm and visual tension. I also used a broken grid layout to show a busy and unorganized working style. For images, I used eyes, nose, mouth, and hand photos to represent a solopreneur and show how one person does many roles. I used a collage method to place these images and create a more direct visual story instead of a simple explanation. In the end, this booklet is a multi-layered design where typography and images interact with each other to express the complex and busy life of a solopreneur.",
      layout: "featured"
    },
    {
      id: 2,
      title: "Second Booklet",
      meta: "2025 · Booklet",
      desc: "The second booklet was a project that used only typography and layout without any images. I used light blue and blue colors to represent business, showing trust and professionalism. I used one font, but I used different weights and families to create typographic hierarchy. This helped to clearly show the structure between title, body text, and emphasis, and improved readability. I also experimented with different layouts using a grid system and used a lot of white space to organize the flow of information. I applied scale, alignment, repetition, and contrast to create visual rhythm and emphasis using only text. In the end, this project explored how typography alone can communicate a message effectively and helped me expand my design expression.",
      layout: "half"
    },
    {
      id: 1,
      title: "First Booklet",
      meta: "2025 · Booklet",
      desc: "The article is about solopreneurs who run their own business and how they can grow their business in 2026. The five tips are: identify problem and prove solution, start small amount, maximize savings, build a clear brand, and lastly plan growth. This first booklet is based on choosing an article and making it visual using a newspaper by hand. So I created a visual booklet that shows the five tips. In this first booklet, I used the texture and layout of real newspaper pages and made a real hands-on collage by cutting paper and using the booklet in a physical way. I also think that working with your hands means something that cannot be replaced by digital prints. I separated the five tips into different visual modules to make information hierarchy more clear.",
      layout: "half"
    }
  ],
  files: {
    1: [
      "./image/project1/booklet_Page_1.jpg",
      "./image/project1/booklet_Page_2.jpg",
      "./image/project1/booklet_Page_3.jpg",
      "./image/project1/booklet_Page_4.jpg",
      "./image/project1/booklet_Page_5.jpg",
      "./image/project1/booklet_Page_6.jpg",
      "./image/project1/booklet_Page_7.jpg"
    ],
    2: [
      "./project2/spread.jpg",
      "./project2/cover1.jpg",
      "./project2/o.jpg",
      "./project2/22.jpg",
      "./project2/33.jpg",
      "./project2/44.jpg",
      "./project2/55.jpg",
      "./project2/66.jpg",
      "./project2/back1.jpg"
    ],
    3: [
      "./image/project3/mockup.jpg",
      "./image/project3/mockup2.jpg",
      "./image/project3/cover.jpg",
      "./image/project3/1.jpg",
      "./image/project3/2.jpg",
      "./image/project3/3.jpg",
      "./image/project3/4.jpg",
      "./image/project3/5.jpg",
      "./image/project3/6.jpg",
      "./image/project3/back2.jpg"
    ]
  }
};

function renderGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  state.projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = `gi ${project.layout || "half"}`;
    card.onclick = () => openDetail(project.id);

    const files = state.files[project.id] || [];
    if (files.length) {
      const img = document.createElement("img");
      img.src = files[0];
      img.alt = project.title;
      card.appendChild(img);
    }

    const copy = document.createElement("div");
    copy.className = "gi-copy";
    copy.innerHTML = `
      <div>
        <div class="gi-title">${project.title}</div>
        <div class="gi-meta">${project.meta}</div>
      </div>
      <div class="gi-cta">Open Page</div>
    `;
    card.appendChild(copy);

    grid.appendChild(card);
  });

  addCursorHover();
}

function renderSlides(id) {
  const track = document.getElementById("slides");
  const dots = document.getElementById("slider-dots");
  const files = state.files[id] || [];

  track.innerHTML = "";
  dots.innerHTML = "";
  state.currentSlide = 0;

  if (!files.length) {
    track.innerHTML = `
      <div class="slide">
        <div class="empty-state">No images were found for this project yet.</div>
      </div>
    `;
    updateSliderUI();
    return;
  }

  files.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <div class="slide-card">
        <div class="slide-media">
          <img class="slide-img" src="${src}" alt="Project image ${index + 1}">
        </div>
        <div class="slide-caption">
          <span>${String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.onclick = () => goToSlide(index);
    dots.appendChild(dot);
  });

  bindSwipe();
  updateSliderUI();
  addCursorHover();
}

function updateSliderUI() {
  const track = document.getElementById("slides");
  const dots = Array.from(document.querySelectorAll(".slider-dot"));
  const files = state.files[state.currentId] || [];
  const hasSlides = files.length > 0;

  track.style.transform = `translateX(-${state.currentSlide * 100}%)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === state.currentSlide);
  });

  document.querySelector(".slider-arrow.prev").style.display = hasSlides ? "block" : "none";
  document.querySelector(".slider-arrow.next").style.display = hasSlides ? "block" : "none";
}

function goToSlide(index) {
  const files = state.files[state.currentId] || [];
  if (!files.length) return;

  const maxIndex = files.length - 1;
  state.currentSlide = Math.max(0, Math.min(index, maxIndex));
  updateSliderUI();
}

function prevSlide() {
  const files = state.files[state.currentId] || [];
  if (!files.length) return;
  state.currentSlide = (state.currentSlide - 1 + files.length) % files.length;
  updateSliderUI();
}

function nextSlide() {
  const files = state.files[state.currentId] || [];
  if (!files.length) return;
  state.currentSlide = (state.currentSlide + 1) % files.length;
  updateSliderUI();
}

function bindSwipe() {
  const slider = document.getElementById("slider");
  slider.ontouchstart = (event) => {
    state.touchStartX = event.touches[0].clientX;
    state.touchDeltaX = 0;
  };

  slider.ontouchmove = (event) => {
    state.touchDeltaX = event.touches[0].clientX - state.touchStartX;
  };

  slider.ontouchend = () => {
    if (Math.abs(state.touchDeltaX) > 45) {
      if (state.touchDeltaX < 0) nextSlide();
      else prevSlide();
    }
    state.touchStartX = 0;
    state.touchDeltaX = 0;
  };

  slider.onpointerdown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    state.pointerActive = true;
    state.touchStartX = event.clientX;
    state.touchDeltaX = 0;
  };

  slider.onpointermove = (event) => {
    if (!state.pointerActive) return;
    state.touchDeltaX = event.clientX - state.touchStartX;
  };

  slider.onpointerup = () => {
    if (!state.pointerActive) return;
    if (Math.abs(state.touchDeltaX) > 60) {
      if (state.touchDeltaX < 0) nextSlide();
      else prevSlide();
    }
    state.pointerActive = false;
    state.touchStartX = 0;
    state.touchDeltaX = 0;
  };

  slider.onpointerleave = () => {
    state.pointerActive = false;
    state.touchStartX = 0;
    state.touchDeltaX = 0;
  };
}

function openDetail(id, shouldPush = true) {
  const project = state.projects.find((item) => item.id === id);
  if (!project) return;

  state.currentId = id;

  setText("d-title", project.title);
  setText("d-meta", project.meta);
  setText("d-headline", project.headline);
  setText("d-desc", project.desc);

  renderSlides(id);

  if (shouldPush) {
    history.pushState({ id }, "", `#project-${id}`);
  }
  show("detail");
  hide("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onpopstate = (event) => {
  if (event.state && event.state.id) {
    openDetail(event.state.id, false);
  } else {
    goHome(false);
  }
};

function goHome(shouldPush = true) {
  if (shouldPush) {
    history.pushState({}, "", "#home");
  }
  show("home");
  hide("detail");
  renderGrid();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToWork() {
  const section = document.getElementById("work-section");
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function show(id) {
  document.getElementById(id).classList.add("active");
}

function hide(id) {
  document.getElementById(id).classList.remove("active");
}

function setText(id, value) {
  const node = document.getElementById(id);
  node.textContent = value || "";
}

const cur = document.getElementById("cur");
const ring = document.getElementById("cur-ring");
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener("mousemove", (event) => {
  mx = event.clientX;
  my = event.clientY;
  cur.style.left = mx + "px";
  cur.style.top = my + "px";
});

function animateCursor() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animateCursor);
}

function addCursorHover() {
  document.querySelectorAll("a, button, .gi, .back, .slider-dot, .slider-arrow").forEach((element) => {
    element.onmouseenter = () => document.body.classList.add("hover");
    element.onmouseleave = () => document.body.classList.remove("hover");
  });
}

document.addEventListener("mousedown", () => document.body.classList.add("click"));
document.addEventListener("mouseup", () => document.body.classList.remove("click"));

document.addEventListener("keydown", (event) => {
  if (!document.getElementById("detail").classList.contains("active")) return;
  if (event.key === "ArrowLeft") prevSlide();
  if (event.key === "ArrowRight") nextSlide();
  if (event.key === "Escape") goHome();
});

if (window.matchMedia("(pointer: coarse)").matches) {
  cur.style.display = "none";
  ring.style.display = "none";
}

animateCursor();
renderGrid();

if (window.location.hash.startsWith("#project-")) {
  const id = Number(window.location.hash.replace("#project-", ""));
  if (id) {
    openDetail(id, false);
  }
}
