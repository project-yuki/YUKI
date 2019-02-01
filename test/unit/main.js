require("module").globalPaths.push(
  require("path").resolve(__dirname, "../../node_modules")
);

// require all test files (files that ends with .spec.js)
const testsContext = require.context("./specs/main", true, /\.spec$/);
testsContext.keys().forEach(testsContext);
