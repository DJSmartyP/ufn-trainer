(() => {
  "use strict";

  const content = window.UFN_CONTENT;
  if (!content) return;

  // Portal navigation terminology.
  const home = content.home;
  if (home?.tabs?.[0]) {
    home.tabs[0].label = "Home";
    home.tabs[0].content = home.tabs[0].content
      .replace(/Open Sector Briefing/g, "Open Basic Training");
  }

  // The former General Briefing / General Sector Briefing area is now Basic Training.
  const basicTraining = content.general;
  if (basicTraining) {
    basicTraining.eyebrow = "UFN TRAINING // BASIC TRAINING";
    basicTraining.title = "Basic Training";
    basicTraining.subtitle = "Core fleet knowledge, personnel standards, intelligence and operational procedures for UFN crews. Mission era: Year 2247 - Frontier Expansion Era.";
  }
})();
