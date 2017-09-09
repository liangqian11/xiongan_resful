module.exports = {
  root: true,
  parser: 'babel-eslint',
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  "extends": "standard",
  // required to lint *.html, *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  "rules": {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0
  }
}
