import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

const { typescriptEs6Declarations, cssVariables, javascriptEs6 } = formats;
const { js } = transformGroups;

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED
function getStyleDictionaryConfig(brand) {
  return {
    log: {
      verbosity: 'verbose'
    },
    // Base first, brand last: Style Dictionary keeps the last definition, so brand tokens override base ones.
    source: ['src/tokens/base/**/*.json', `src/tokens/brands/${brand}/*.json`],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: `dist/${brand}/css/`,
        files: [
          {
            destination: '_variables.css',
            format: cssVariables,
          },
        ],
      },
      js: {
        transformGroup: js,
        buildPath: `dist/${brand}/`,
        files: [
          {
            destination: 'index.js',
            format: javascriptEs6,
          },
        ],
      },
      ts: {
        transformGroup: js,
        buildPath: `dist/${brand}/`,
        files: [
          {
            destination: 'index.d.ts',
            format: typescriptEs6Declarations,
            options: {
              outputLiteralTypes: true,
            },
          },
        ],
      },
    },
  };
}

console.log('Build started...');

['obsidiana', 'ixiptla'].map(function (brand) {
  console.log('\n==============================================');
  console.log(`\nProcessing: [${brand}]`);

  const sd = new StyleDictionary(getStyleDictionaryConfig(brand));
  sd.buildAllPlatforms();
});

console.log('\n==============================================');
console.log('\nBuild completed!');
