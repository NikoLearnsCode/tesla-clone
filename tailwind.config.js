module.exports = {
  content: ['./*.html', './*.js', './views/**/*.ejs', './public/**/*.js'],
  safelist: [
    {
      pattern: /mt-(\d+)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['noto-sans', 'poppins', 'Balthazar', 'roboto', 'open-sans'],
      },
      screens: {
        mqxs: '450px',
        mq850: '850px',
      },
    },
  },
  plugins: [],
};
