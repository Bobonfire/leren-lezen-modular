// stylelint.config.cjs
module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "color-named": "never",
    "declaration-block-no-redundant-longhand-properties": true
  },
  ignoreFiles: ["dist/**/*.css"]
};
