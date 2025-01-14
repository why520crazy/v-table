module.exports = {
    allowBranch: ['develop', 'release-auto-*'],
    bumpFiles: ['package.json', 'package-lock.json', 'packages/grid/package.json', 'packages/state/package.json'],
    skip: {
        confirm: true
    },
    // backward compatibility changelog
    // because we didn't use tag prefix(v) when create tag before
    // should set tagPrefix as empty (default is 'v')
    // otherwise, the changelog will rebuild, and will be lost past versions
    tagPrefix: '',
    hooks: {
        prepublish: 'npm run build',
        prereleaseBranch: 'node ./scripts/pre-release.js {{version}}'
    }
};
