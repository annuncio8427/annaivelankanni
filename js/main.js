/**
 * Annai Velankanni Matriculation Higher Secondary School
 * Modern UI Interactive Controller - Responsiveness, Tabs, Lightbox, Modals, Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initStickyHeader();
  initCounterStats();
  initTabs();
  initFaqAccordion();
  initGalleryFilter();
  initLightbox();
  initModals();
  initForms();
  initBackToTop();
  initScrollSpy();
});

/* ==========================================================================
   1. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileMenuClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  const navLinks = drawer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. Sticky Island Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Animated Stat Counters
   ========================================================================== */
function initCounterStats() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const suffix = counter.hasAttribute('data-suffix') ? counter.getAttribute('data-suffix') : '';
        const duration = 1800;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target.toLocaleString('en-IN') + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toLocaleString('en-IN') + (suffix === '%' ? '%' : '');
          }
        }, stepTime);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. Tab Switcher
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs-container]');
  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabPanels = container.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');

        tabButtons.forEach(b => {
          b.classList.remove('active', 'bg-sky-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
        });

        btn.classList.add('active', 'bg-sky-600', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');

        tabPanels.forEach(panel => {
          if (panel.id === target) {
            panel.classList.remove('hidden');
            panel.classList.add('block');
          } else {
            panel.classList.add('hidden');
            panel.classList.remove('block');
          }
        });
      });
    });
  });
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const accordionButtons = document.querySelectorAll('.accordion-btn');
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const isExpanded = item.classList.contains('active');

      const container = item.closest('.accordion-group');
      if (container) {
        container.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      item.classList.toggle('active', !isExpanded);
    });
  });
}

/* ==========================================================================
   6. Gallery Filter
   ========================================================================== */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-category]');

  if (!filterButtons.length || !galleryItems.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      });

      btn.classList.add('bg-sky-600', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');

      const filter = btn.getAttribute('data-gallery-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-gallery-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Image Lightbox
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const triggerElements = document.querySelectorAll('[data-lightbox-src]');

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;
  const items = Array.from(triggerElements);

  function openLightbox(index) {
    currentIndex = index;
    const item = items[currentIndex];
    const src = item.getAttribute('data-lightbox-src') || item.getAttribute('src');
    const caption = item.getAttribute('data-caption') || item.getAttribute('alt') || 'Campus View';

    lightboxImg.src = src;
    lightboxImg.alt = caption;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  function prevImage() {
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

/* ==========================================================================
   8. Modals
   ========================================================================== */
function initModals() {
  const openButtons = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.remove('hidden');
        targetModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-container');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-container').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ==========================================================================
   9. Forms Handling
   ========================================================================== */
function initForms() {
  const admissionForms = document.querySelectorAll('.admission-form');
  admissionForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
      }

      setTimeout(() => {
        const nameInput = form.querySelector('[name="studentName"]') || form.querySelector('[name="name"]');
        const studentName = nameInput ? nameInput.value : 'Student';
        const gradeInput = form.querySelector('[name="grade"]');
        const grade = gradeInput ? gradeInput.value : 'Admission';

        const parentModal = form.closest('.modal-container');
        if (parentModal) {
          parentModal.classList.add('hidden');
          parentModal.classList.remove('flex');
          document.body.style.overflow = '';
        }

        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        showToast(`Thank you! Admission enquiry for "${studentName}" (${grade}) received. Our admissions desk will call you shortly.`, 'success');
      }, 850);
    });
  });

  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
      }

      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        showToast('Message received! Annai Velankanni School administrative team will reply soon.', 'success');
      }, 750);
    });
  });
}

/* ==========================================================================
   10. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. ScrollSpy & Current Nav Active State
   ========================================================================== */
function initScrollSpy() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-sky-600', 'font-bold', 'bg-sky-50', 'border-b-2', 'border-sky-500');
      link.classList.remove('text-slate-600');
    }
  });
}

/* ==========================================================================
   12. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-sky-950/95 border-sky-400 text-white' : 'bg-slate-900/95 border-amber-400 text-white';
  const icon = type === 'success' ? 'fa-check-circle text-sky-400' : 'fa-info-circle text-amber-400';

  toast.className = `${bgClass} border-l-4 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 pointer-events-auto transition-all duration-300 transform translate-y-4 opacity-0 text-sm`;
  toast.innerHTML = `
    <i class="fas ${icon} text-lg mt-0.5 flex-shrink-0"></i>
    <div class="flex-1 font-medium leading-relaxed">${message}</div>
    <button class="text-slate-400 hover:text-white p-1" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}
