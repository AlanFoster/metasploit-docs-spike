module.exports = {
  siteMetadata: {
    title: 'Metasploit Documentation',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'contents',
        path: `${__dirname}/contents`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Metasploit',
        short_name: 'metasploit',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/metasploit-icon.png', // This path is relative to the root of the site.
      },
    },
    // {
    //   resolve: 'gatsby-transformer-remark',
    //   options: {
    //     plugins: ['gatsby-remark-images'],
    //   },
    // },
    {
      // TODO: Don't use mdx for now - https://www.gatsbyjs.org/blog/2019-11-21-how-to-convert-an-existing-gatsby-blog-to-use-mdx/
      // resolve: 'gatsby-plugin-mdx',
      resolve: `gatsby-transformer-remark`,
      options: {
        defaultLayouts: {
          default: require.resolve('./src/Layout.tsx'),
        },
        // extensions: ['.mdx', '.md'],
        // workaround: https://github.com/gatsbyjs/gatsby/issues/16422#issuecomment-518985316
        // gatsbyRemarkPlugins: [
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1035,
            },
          },
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              showLineNumbers: true,
              noInlineHighlight: false,
            },
          },
        ],
      },
    },
    'gatsby-plugin-remove-trailing-slashes',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
  /// this must match the path your webpage is displayed from
  pathPrefix:
    process.env.NODE_ENV === 'development' ? '' : '/metasploit-docs-spike',
};
