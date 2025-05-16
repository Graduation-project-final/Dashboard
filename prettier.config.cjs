(async () => {
  const prettierTailwindPlugin = await import("prettier-plugin-tailwindcss");
  
  module.exports = {
    tailwindConfig: "./tailwind.config.cjs",
    plugins: [prettierTailwindPlugin],
  };
})();
