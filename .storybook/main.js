module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  features: {
    //Issue related: https://github.com/storybookjs/storybook/issues/16099#issuecomment-964445878
    //Released solution: https://github.com/storybookjs/storybook/releases/tag/v6.4.0-beta.31
    emotionAlias: false,
  },
};
