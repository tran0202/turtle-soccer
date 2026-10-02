// Metro (React Native's bundler) doesn't resolve monorepo workspace packages
// out of the box the way Next.js's webpack does — it needs to be told to
// watch the whole monorepo (not just this app's own folder) and to look in
// both this app's node_modules and the root's when resolving a package.
// This is Expo's own documented pattern for monorepo support.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo, so changes in packages/core trigger a reload.
config.watchFolders = [workspaceRoot];

// Resolve packages from this app's node_modules first, then the hoisted
// root node_modules (where most shared deps actually live in a workspace).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = config;
