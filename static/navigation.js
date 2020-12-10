const toMain = () => {
    render.redirect("/");
}
const login = () => {
    render.redirect("/auth/login");
}
const register = () => {
    render.redirect("/auth/register");
}
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});