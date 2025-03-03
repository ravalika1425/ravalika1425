require("ignore-styles")
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
  extensions: [".jsx", ".js", ".tsx", ".ts"],
})
require("./server")
