/**
 * CONTROLADOR — Portal de clientes
 * Protege la página (sin sesión, vuelve al login) y gestiona estimaciones y cierre de sesión.
 */
const PortalController = {
  init() {
    const session = SessionModel.get();
    if (!session) {
      window.location.replace("login.html");
      return;
    }
    document.getElementById("portal-root").innerHTML = PortalView.render(session, EstimateModel.list(session.usuario));
    Dom.icons();

    document.addEventListener("click", (e) => {
      if (e.target.closest("#logout")) {
        SessionModel.end();
        window.location.assign("login.html");
        return;
      }
      const del = e.target.closest("[data-delete-estimate]");
      if (del) {
        PortalView.renderEstimates(EstimateModel.remove(session.usuario, del.dataset.deleteEstimate));
        ToastView.show("Estimación eliminada.");
      }
    });
  },
};
