/* Local stub — full VoidChat lives in aetherhaven-multiverse when published */
(function (w) {
  "use strict";
  if (w.VoidChat) return;
  w.VoidChat = {
    openMIST: function () {
      console.info("[VoidChat stub] MIST surface not bundled on this host.");
    },
    openCyberRoom: function () {
      console.info("[VoidChat stub] Cyber room not bundled on this host.");
    },
    ready: false,
    stub: true,
  };
})(window);
