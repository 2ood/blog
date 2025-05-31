module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@next/next/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': [1, { custom: 'ignore' }],
    'react/prop-types': [0],

    // 💥 린트 오류 방지용 추가
    'eol-last': 'off',
    'indent': 'off',
    'no-trailing-spaces': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/self-closing-comp': 'off',
    'import/order': 'off',
    'lines-around-directive': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'implicit-arrow-linebreak': 'off',
    'arrow-parens': 'off',
    'padded-blocks': 'off',
    'comma-dangle': 'off',
    'operator-linebreak': 'off',
    'block-spacing': 'off',
    'brace-style': 'off',
    'no-multiple-empty-lines': 'off',
    'react/no-array-index-key': 'off',
    'no-shadow': 'off',
    'no-undef-init': 'off',
  },
};
