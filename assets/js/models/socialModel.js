/**
 * MODELO — Bloque social (página de Facebook)
 * Mantiene el estado de "seguir / dejar de seguir" y lo recuerda en el navegador.
 */
const SocialModel = {
  key: "isa-following",

  page: {
    name: "ISA Energía en Colombia",
    followers: 18139,
    following: false,
  },

  /** Recupera el estado guardado (si el almacenamiento no está disponible, sigue en memoria). */
  load() {
    try {
      if (localStorage.getItem(this.key) === "1" && !this.page.following) {
        this.page.following = true;
        this.page.followers += 1;
      }
    } catch (_) {
      /* almacenamiento bloqueado: se ignora */
    }
    return this.page;
  },

  /** Alterna el estado de seguimiento y ajusta el contador de seguidores */
  toggleFollow() {
    this.page.following = !this.page.following;
    this.page.followers += this.page.following ? 1 : -1;
    try {
      if (this.page.following) localStorage.setItem(this.key, "1");
      else localStorage.removeItem(this.key);
    } catch (_) {
      /* se ignora */
    }
    return this.page;
  },

  get() {
    return this.page;
  },
};
