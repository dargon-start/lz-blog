const moment = require("moment");
moment.locale("zh-cn");

module.exports = {
  base: "lz-blog",
  title: "LongZai",
  description: "龙仔的个人博客！",
  head: [
    ["link", {rel: "icon", href: "/assets/img/logo.png"}],
    [
      "meta",
      {name: "Keywords", content: "龙仔，longzai,LongZai,龙仔的个人博客"},
    ],
    ["meta", {name: "author", content: "龙仔,longzai,LongZai"}],
  ],
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          return moment(timestamp).format("ll");
        },
      },
    ],
  ],
  themeConfig: {
    logo: "/assets/img/logo.png",
    displayAllHeaders: true,
    activeHeaderLinks: false,
    lastUpdated: "更新时间",
    nav: [
      {text: "Home", link: "/"},
      {
        text: "Category",
        ariaLabel: "Language Menu",
        items: [{text: "webpack", link: "/categorize/webpack.md"}],
      },
      {text: "Tag", link: "/tag/"},
      {text: "Bug", link: "/bug/"},
      {text: "Tools", link: "/tool/"},
      {text: "Project", link: "/project/"},
      {text: "About", link: "/about/"},
    ],
    sidebar: "auto",
  },
};
