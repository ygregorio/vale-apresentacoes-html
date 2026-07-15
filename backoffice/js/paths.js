/** Base path para GitHub Pages (projeto em /vale-apresentacoes-html/). */

const REPO_SLUG = "vale-apresentacoes-html";

export function appBase() {
  const { hostname, pathname } = window.location;
  if (hostname.endsWith("github.io")) {
    const prefix = `/${REPO_SLUG}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }
  return "";
}

export function appUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${appBase()}${normalized}`;
}

export function isGitHubPages() {
  return window.location.hostname.endsWith("github.io");
}

export function backofficePath(page = "login.html") {
  return appUrl(`/backoffice/${page.replace(/^\//, "")}`);
}

export function portalPath() {
  return appUrl("/index.html");
}
