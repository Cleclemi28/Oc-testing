import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * La page est animée par GSAP. Le scroll natif est conservé (meilleure
 * accessibilité, pas de hijack du scroll) : ScrollSmoother n'est activé que
 * si l'environnement le permet sans dégrader le pinning de la galerie.
 */
const USE_SMOOTHER = false;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

declare global {
  interface Window {
    __animReady?: boolean;
    __animFailed?: boolean;
  }
}

/* Marque la page comme prête : évite le fallback anti-FOUC du <head>. */
window.__animReady = true;

/* Si le <head> a déjà déclenché le filet de sécurité, le contenu a été rendu
   sans animation : on n'anime plus les révélations (pas de clignotement). */
const degraded = Boolean(window.__animFailed);

/**
 * L'intro est pilotée en CSS (indépendant du requestAnimationFrame) : on
 * attend simplement qu'elle soit sortie de l'écran avant de lancer les
 * animations du hero, pour que rien ne bouge « sous » l'overlay.
 */
function waitIntro(): Promise<void> {
  return new Promise((resolve) => {
    const intro = document.querySelector<HTMLElement>('[data-intro]');

    if (!intro || reducedMotion || degraded) {
      document.documentElement.classList.remove('is-loading');
      resolve();
      return;
    }

    const finish = () => {
      intro.classList.add('is-done');
      document.documentElement.classList.remove('is-loading');
      window.setTimeout(() => intro.remove(), 800);
      resolve();
    };

    /* L'overlay commence à sortir à 1 s : on ne bloque pas le LCP plus longtemps. */
    window.setTimeout(finish, 1000);
  });
}

async function init() {
  if (reducedMotion) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
    });
    document.documentElement.classList.remove('is-loading');
    ScrollTrigger.refresh();
    return;
  }

  await waitIntro();

  /* ---------------------------------------------------------------------
     1. Révélations génériques
     --------------------------------------------------------------------- */
  const revealPresets: Record<string, gsap.TweenVars> = {
    'fade-up': { y: 28 },
    fade: { y: 0 },
    scale: { scale: 0.94 },
    left: { x: -32 },
    right: { x: 32 },
  };

  if (!degraded) {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      const preset = revealPresets[el.dataset.reveal ?? 'fade-up'] ?? revealPresets['fade-up'];
      gsap.fromTo(
        el,
        { opacity: 0, ...preset },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    });
  }

  /* ---------------------------------------------------------------------
     2. Hero — parallaxe multi-couches + cascade du titre
     --------------------------------------------------------------------- */
  const hero = document.querySelector<HTMLElement>('[data-hero]');

  if (hero) {
    const media = hero.querySelector<HTMLElement>('[data-hero-media]');
    const badges = hero.querySelector<HTMLElement>('[data-hero-badges]');
    const title = hero.querySelector<HTMLElement>('.hero__title');
    const fades = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
      .from(fades, { opacity: 0, y: 26, duration: 0.9, stagger: 0.12 }, 0.1)
      .from(hero.querySelector('.hero__scroll'), { opacity: 0, y: 12, duration: 0.6 }, 0.7);

    if (media) {
      gsap.to(media, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    if (badges) {
      gsap.to(badges, {
        yPercent: -26,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    if (title) {
      SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.15,
            stagger: 0.11,
            ease: 'power4.out',
            delay: 0.15,
          }),
      });

      gsap.to(title, {
        yPercent: -18,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    /* Halo qui suit le curseur sur le hero (profondeur, sans coût GPU). */
    const spotlight = hero.querySelector<HTMLElement>('[data-hero-spotlight]');
    if (spotlight && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hero.addEventListener(
        'pointermove',
        (event) => {
          const rect = hero.getBoundingClientRect();
          spotlight.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          spotlight.style.setProperty('--my', `${event.clientY - rect.top}px`);
        },
        { passive: true }
      );
    }
  }

  /* ---------------------------------------------------------------------
     3. Manifeste — révélation ligne par ligne + mots qui s'allument
     --------------------------------------------------------------------- */
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    if (el.closest('[data-hero]')) return; // déjà traité

    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 108,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
    /* Pas d'autoSplit ici : le découpage en mots ne dépend pas du
       chargement des polices, on évite de recréer le ScrollTrigger.
       `aria: 'none'` : un aria-label sur un <p> est interdit par la
       spécification ARIA (rôle paragraph) — les mots restent lus dans
       l'ordre, en flux, sans rupture. */
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word', aria: 'none' });

    gsap.fromTo(
      split.words,
      { opacity: 0.22 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.6,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 62%', scrub: 0.4 },
      }
    );
  });

  /* ---------------------------------------------------------------------
     4. Bandeau de logos — défilement infini
     --------------------------------------------------------------------- */
  gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((viewport) => {
    const track = viewport.querySelector<HTMLElement>('.partners__track');
    const set = viewport.querySelector<HTMLElement>('.partners__set');
    if (!track || !set) return;

    const direction = Number(viewport.dataset.direction ?? '1');
    const speed = 42; // px/s

    /* Duplique le jeu de logos tant que la piste ne couvre pas 2× la largeur visible. */
    const setWidth = () => set.getBoundingClientRect().width;
    let copies = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(1, setWidth())));
    for (let i = track.children.length; i < copies; i += 1) {
      const clone = set.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''));
      track.appendChild(clone);
    }

    let unit = setWidth();

    const tween = gsap.to(track, {
      x: () => -unit * direction,
      duration: () => unit / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        /* On reboucle sur une largeur de set : la fin de piste colle au début. */
        x: (value) => {
          const raw = parseFloat(value);
          const wrapped = ((raw % unit) + unit) % unit;
          return `${direction > 0 ? -wrapped : wrapped}`;
        },
      },
    });

    let resizeTimer = 0;
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          unit = setWidth();
          tween.invalidate();
        }, 180);
      },
      { passive: true }
    );
  });

  /* ---------------------------------------------------------------------
     5. Bandeau typographique — défilement piloté par le scroll
     --------------------------------------------------------------------- */
  gsap.utils.toArray<HTMLElement>('[data-band]').forEach((band) => {
    const track = band.querySelector<HTMLElement>('.band__track');
    if (!track) return;

    gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  /* ---------------------------------------------------------------------
     6. Galerie — défilement horizontal épinglé
     --------------------------------------------------------------------- */
  const gallery = document.querySelector<HTMLElement>('[data-gallery]');

  if (gallery && !degraded) {
    const pin = gallery.querySelector<HTMLElement>('[data-gallery-pin]');
    const track = gallery.querySelector<HTMLElement>('[data-gallery-track]');
    const progress = gallery.querySelector<HTMLElement>('[data-gallery-progress]');

    if (pin && track) {
      const items = [...track.querySelectorAll<HTMLElement>('[data-gallery-item]')];

      /* La largeur du rail se mesure sur la mise en page (offsetWidth) :
         scrollWidth est gonfle par les transformations 3D des cartes. */
      const layoutWidth = () => {
        const first = items[0];
        if (!first) return 0;

        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap) || 0;
        const padding = (parseFloat(styles.paddingLeft) || 0) + (parseFloat(styles.paddingRight) || 0);

        return items.length * first.offsetWidth + Math.max(0, items.length - 1) * gap + padding;
      };

      const travel = () => Math.max(0, layoutWidth() - window.innerWidth);
      /* 2,2 écrans de défilement : la galerie file sans rallonger la page. */
      const pinDistance = () => Math.round(window.innerHeight * 2.2);

      /* Chargement progressif : seules les bannières proches du champ
         sont téléchargées (pas d'IntersectionObserver : on s'appuie sur
         la position réelle, fiable y compris pendant le pinning). */
      const loadVisible = () => {
        const hMargin = window.innerWidth;
        const vMargin = window.innerHeight * 2;

        for (const item of items) {
          const img = item.querySelector<HTMLImageElement>('[data-gallery-img]');
          if (!img || img.dataset.requested) continue;

          const rect = item.getBoundingClientRect();
          const inView =
            rect.right > -hMargin &&
            rect.left < window.innerWidth + hMargin &&
            rect.bottom > -vMargin &&
            rect.top < window.innerHeight + vMargin;

          if (inView) {
            img.dataset.requested = '1';

            const srcset = img.dataset.srcset;
            if (srcset) img.srcset = srcset;

            const src = img.dataset.src;
            if (!src) continue;

            /* L'apparition est déclenchée à la réception réelle du fichier. */
            const reveal = () => {
              img.dataset.loaded = '1';
            };

            if (img.complete && img.naturalWidth > 0) {
              reveal();
            } else {
              img.addEventListener('load', reveal, { once: true });
              img.src = src;
            }
          }
        }
      };

      /* Profondeur : les bannières s'inclinent et s'éloignent selon leur
         position dans le rail (effet coverflow). */
      const depthCards = () => {
        const vw = window.innerWidth;

        for (const item of items) {
          const rect = item.getBoundingClientRect();
          if (rect.right < -280 || rect.left > vw + 280) continue;

          const offset = (rect.left + rect.width / 2 - vw / 2) / (vw / 2);
          const clamped = Math.max(-1.6, Math.min(1.6, offset));
          const depth = Math.min(1, Math.abs(clamped));

          gsap.set(item, {
            transformPerspective: 1100,
            rotateY: clamped * 15,
            z: -depth * 150,
            scale: 1 - depth * 0.12,
            opacity: 1 - depth * 0.5,
          });
        }
      };

      loadVisible();

      let frame = 0;
      window.addEventListener(
        'scroll',
        () => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            loadVisible();
          });
        },
        { passive: true }
      );

      gsap.to(track, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${pinDistance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) gsap.set(progress, { scaleX: self.progress });
            loadVisible();
            depthCards();
          },
          onRefresh: () => {
            loadVisible();
            depthCards();
          },
        },
      });
    }
  }

  /* ---------------------------------------------------------------------
     7. Étapes — rail qui s'illumine + activation des cartes
     --------------------------------------------------------------------- */
  const stepsList = document.querySelector<HTMLElement>('[data-steps]');

  if (stepsList) {
    const fill = stepsList.querySelector<HTMLElement>('[data-steps-fill]');

    if (fill) {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: stepsList,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: 0.4,
          },
        }
      );
    }

    gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        end: 'bottom 42%',
        onEnter: () => step.classList.add('is-active'),
        onEnterBack: () => step.classList.add('is-active'),
      });
    });
  }

  /* ---------------------------------------------------------------------
     8. Piliers — cartes empilées + inclinaison 3D au survol
     --------------------------------------------------------------------- */
  const pillars = document.querySelector<HTMLElement>('[data-pillars]');

  if (pillars) {
    const cards = [...pillars.querySelectorAll<HTMLElement>('[data-tilt]')];

    /* Les cartes « se distribuent » : elles entrent en biais puis se posent. */
    if (!degraded) {
      gsap.from(cards, {
        opacity: 0,
        y: 64,
        rotate: (index: number) => (index % 2 === 0 ? -2.5 : 2.5),
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: pillars, start: 'top 78%', once: true },
      });
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      for (const card of cards) {
        card.addEventListener('pointermove', (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            transformPerspective: 1200,
            rotateY: x * 8,
            rotateX: -y * 8,
            y: -6,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });

        card.addEventListener('pointerleave', () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: 'power3.out' });
        });
      }
    }
  }

  /* ---------------------------------------------------------------------
     9. Intervenants — cascade + rotation 3D
     --------------------------------------------------------------------- */
  const teamGrid = document.querySelector<HTMLElement>('.team__grid');

  if (teamGrid) {
    const cards = teamGrid.querySelectorAll<HTMLElement>('[data-team-card]');
    gsap.from(cards, {
      opacity: 0,
      y: 70,
      rotateX: 22,
      rotateZ: -5,
      duration: 1,
      stagger: 0.09,
      ease: 'power3.out',
      transformOrigin: 'center bottom',
      scrollTrigger: { trigger: teamGrid, start: 'top 82%', once: true },
    });
  }

  /* ---------------------------------------------------------------------
     10. Chiffres clés — compteurs animés
     --------------------------------------------------------------------- */
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? '0');
    const format = el.dataset.format === 'space';
    const counter = { value: 0 };

    gsap.to(counter, {
      value: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        const rounded = Math.round(counter.value);
        el.textContent = format
          ? rounded.toLocaleString('fr-FR').replace(/ | /g, ' ')
          : String(rounded);
      },
    });
  });

  /* ---------------------------------------------------------------------
     11. Barre de progression du scroll
     --------------------------------------------------------------------- */
  const progressBar = document.querySelector<HTMLElement>('[data-progress-bar]');

  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
      },
    });
  }

  /* ---------------------------------------------------------------------
     12. Curseur personnalisé (desktop, pointeur fin)
     --------------------------------------------------------------------- */
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');

  if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener(
      'pointermove',
      (event) => {
        dot.style.translate = `${event.clientX}px ${event.clientY}px`;
        ring.style.translate = `${event.clientX}px ${event.clientY}px`;
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
      },
      { passive: true }
    );

    document.addEventListener('pointerover', (event) => {
      const target = (event.target as HTMLElement | null)?.closest(
        'a, button, input, textarea, select, [data-cursor="grow"]'
      );
      ring.classList.toggle('is-grow', Boolean(target));
    });

    document.addEventListener('pointerleave', () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    });
  }

  /* ---------------------------------------------------------------------
     13. Lissage du défilement (optionnel)
     --------------------------------------------------------------------- */
  if (USE_SMOOTHER) {
    const { ScrollSmoother } = await import('gsap/ScrollSmoother');
    gsap.registerPlugin(ScrollSmoother);
    ScrollSmoother.create({ smooth: 1.1, effects: true, normalizeScroll: true });
  }

  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void init(), { once: true });
} else {
  void init();
}
