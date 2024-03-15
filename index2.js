module.exports = () => {
  return {
    postcssPlugin: "postcss-name2",
    Once(root, { Declaration, Rule }) {
      // console.log(root, 2);
      // let rule = new Rule({ selector: "b" });
      // const color = new Declaration({ prop: "color", value: "black" });
      // rule.append(color);
      // root.append(rule);
    },
    // // Root(root, { Rule, Declaration }) {
    // //   let rule = new Rule({ selector: "a" });
    // //   const color = new Declaration({ prop: "color", value: "black" });
    // //   rule.append(color);
    // //   root.append(rule);
    // // },
    // Rule(rule, { Rule, Declaration }) {
    //   let _rule = new Rule({ selector: "a" });
    //   const color = new Declaration({ prop: "color", value: "black" });
    //   rule.append(color);
    //   rule.after(_rule);
    // },
  };
};
module.exports.postcss = true;
