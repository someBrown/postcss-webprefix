const BG_URL_REG = new RegExp(/\burl\((.*?)\)/);
const IGNORE_COMMENT = "webp-ignore";

const DEFAULT_OPTS = {
  prefixSelector: ".webp",
  ignoreComment: IGNORE_COMMENT,
  transformUrl: () => {},
};

module.exports = (opts) => {
  opts = {
    ...DEFAULT_OPTS,
    ...opts,
  };

  const handler = (decl, { Rule, Declaration }) => {
    const { selector } = decl.parent;
    const selectors = selector.split(",").map((s) => s.trim());
    const { transformUrl, prefixSelector, ignoreComment } = opts;
    // 如果已经有 webp 前缀 说明是自己添加的规则
    if (selector.includes(prefixSelector)) {
      return;
    }

    // 注释节点跳过
    const nextDecl = decl.next();
    if (nextDecl?.type === "comment" && nextDecl.text === ignoreComment) {
      return;
    }

    const { prop, value } = decl;
    const originalUrl = value.match(BG_URL_REG)?.[1];
    if (!originalUrl || originalUrl.startsWith("data:")) {
      return;
    }

    const webpUrl = transformUrl(originalUrl);
    // transformUrl return 的值隐式转换是 false 的跳过
    if (!webpUrl) {
      return;
    }

    const newValue = value.replace(BG_URL_REG, () => `url(${webpUrl})`);
    const newRule = new Rule({
      selector: selectors
        .map((selector) => `${prefixSelector} ${selector}`)
        .join(","),
    });
    const newDecl = new Declaration({ prop, value: newValue });
    newRule.append(newDecl);
    decl.parent.after(newRule);
  };

  return {
    postcssPlugin: "postcss-webprefix",
    Declaration: {
      background: handler,
      "background-image": handler,
    },
  };
};

module.exports.postcss = true;
