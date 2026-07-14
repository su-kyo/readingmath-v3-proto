/* =========================================================================
   공용 상호작용 (아코디언 등) — 프레임워크 없이 순수 JS
   [data-accordion] 안의 [data-accordion-header] 클릭 시 열고 닫습니다.
   ========================================================================= */
(function () {
  document.addEventListener("click", function (e) {
    var header = e.target.closest("[data-accordion-header]");
    if (!header) return;
    var acc = header.closest("[data-accordion]");
    if (acc) acc.classList.toggle("is-open");
  });
})();
