// polyfills.ts
if (typeof window !== "undefined" && !window.process) {
    window.process = require("process");
  }