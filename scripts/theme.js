/* =========================================================================
   라이트/다크 테마 전환
   - 기본은 라이트. 다크(우주)는 선택. 고르면 localStorage에 기억합니다.
   - HTML 어디든 [data-mode-toggle] 안에 옵션 두 개를 두면 자동 연결됩니다.
   ========================================================================= */
(function () {
  var KEY = "rm-theme";
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    // 토글 UI 활성 상태 갱신
    document.querySelectorAll("[data-set-theme]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-set-theme") === theme);
    });
  }

  // 초기 적용 (기본 light — 다크는 선택)
  apply(saved === "dark" ? "dark" : "light");

  // 클릭 위임
  document.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-set-theme]");
    if (opt) apply(opt.getAttribute("data-set-theme"));
  });
})();
