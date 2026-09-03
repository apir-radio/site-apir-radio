module.exports = {
  ci: {
    collect: {
      staticDistDir: "./out",
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.75 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
