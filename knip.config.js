module.exports = {
  entry: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'next.config.js',
    'tailwind.config.ts',
    'postcss.config.js'
  ],
  project: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
    '!**/node_modules/**'
  ],
  ignore: [
    'supabase/**',
    'public/**',
    '.next/**',
    'dist/**'
  ],
  ignoreDependencies: [
    '@netlify/plugin-nextjs' // Netlify specific
  ]
};