const postcss = require("postcss");
const { equal } = require("node:assert");
const { test } = require("node:test");

const plugin = require("./");
// const plugin2 = require("./index2.js");

const transformUrl = (url) => {
  return url
    .replace(/\.png/g, ".webp")
    .replace(/\.jpg/g, ".webp")
    .replace(/\.jpeg/g, ".webp")
    .replace("img", "img/webp");
};

async function run(input, output, opts) {
  opts = {
    prefixSelector: ".webp",
    transformUrl,
  };

  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });

  equal(result.css.trim(), output.trim());
  equal(result.warnings().length, 0);
}

test("background", async () => {
  await run(
    "a b,c { background: url('./img/test.png') no-repeat; } b{}",
    "a b,c { background: url('./img/test.png') no-repeat; } .webp a b,.webp c { background: url('./img/webp/test.webp') no-repeat; } b{}"
  );
});

test("background-image", async () => {
  await run(
    "a { background-image: url('./img/test.png') no-repeat; } b{}",
    "a { background-image: url('./img/test.png') no-repeat; } .webp a { background-image: url('./img/webp/test.webp') no-repeat; } b{}"
  );
});

test("rule ignore", async () => {
  await run(
    "a { background-image: url('./img/test.png') no-repeat; /* webp-ignore */} b{}",
    "a { background-image: url('./img/test.png') no-repeat; /* webp-ignore */} b{}"
  );
});

test("pseudo element", async () => {
  await run(
    ".dead-link::after { background: url('../../img/test.png');}",
    ".dead-link::after { background: url('../../img/test.png');}\n.webp .dead-link::after { background: url('../../img/webp/test.webp');}"
  );
});

test("css vars", async () => {
  await run(
    ":root {--main-bg: url('../../img/test.png');} a{background:var(--main-bg)}",
    ":root {--main-bg: url('../../img/test.png');} .webp :root {--main-bg: url('../../img/webp/test.webp');} a{background:var(--main-bg)}"
  );
});
