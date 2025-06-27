class SocialShareComponent {
  constructor() {
    this.shareButton = document.getElementById("share-btn");
    this.closeButton = document.getElementById("close-share-btn");
    this.desktopPanel = document.getElementById("social-desktop");
    this.mobilePanel = document.getElementById("social-mobile");
    this.isOpen = false;

    this.init();
  }

  init() {
    this.shareButton?.addEventListener("click", this.toggleShare.bind(this));
    this.closeButton?.addEventListener("click", this.closeShare.bind(this));

    document.addEventListener("click", this.handleOutsideClick.bind(this));

    document.addEventListener("keydown", this.handleKeydown.bind(this));

    this.setupSocialLinks();
  }

  toggleShare(event) {
    event.stopPropagation();
    this.isOpen ? this.closeShare() : this.openShare();
  }

  openShare() {
    this.isOpen = true;
    this.updateUI();

    setTimeout(() => {
      const firstLink = this.getVisiblePanel()?.querySelector(".social-link");
      firstLink?.focus();
    }, 100);
  }

  closeShare() {
    this.isOpen = false;
    this.updateUI();
    this.shareButton?.focus();
  }

  updateUI() {
    this.shareButton?.setAttribute("aria-expanded", this.isOpen.toString());

    this.desktopPanel?.classList.toggle("active", this.isOpen);
    this.mobilePanel?.classList.toggle("active", this.isOpen);
  }

  getVisiblePanel() {
    const isDesktop = window.matchMedia("(min-width: 48em)").matches;
    return isDesktop ? this.desktopPanel : this.mobilePanel;
  }

  handleOutsideClick(event) {
    if (!this.isOpen) return;

    const shareContainer = event.target.closest(".share-container");
    if (!shareContainer) {
      this.closeShare();
    }
  }

  handleKeydown(event) {
    if (!this.isOpen) return;

    if (event.key === "Escape") {
      this.closeShare();
    }
  }

  setupSocialLinks() {
    const socialLinks = document.querySelectorAll(".social-link");

    socialLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const platform = link.getAttribute("aria-label")?.toLowerCase();
        const url = window.location.href;
        const title =
          document.querySelector(".article-title")?.textContent || "";

        let shareUrl = "";

        if (platform?.includes("facebook")) {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`;
        } else if (platform?.includes("twitter")) {
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`;
        } else if (platform?.includes("pinterest")) {
          const imageUrl =
            document.querySelector(".article-image img")?.src || "";
          shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            url
          )}&media=${encodeURIComponent(
            imageUrl
          )}&description=${encodeURIComponent(title)}`;
        }

        if (shareUrl) {
          window.open(
            shareUrl,
            "_blank",
            "width=600,height=400,scrollbars=yes,resizable=yes"
          );
        }

        setTimeout(() => this.closeShare(), 100);
      });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => new SocialShareComponent()
  );
} else {
  new SocialShareComponent();
}
