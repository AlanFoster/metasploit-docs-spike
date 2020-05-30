require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const wikiQueries = `{
  allMarkdownRemark(
    filter: {
      fileAbsolutePath: {
        regex: "/contents/wiki/"
      }
    }
  ) {
    nodes {
      id
      frontmatter {
        title
        date
      }
      fields {
        slug
      }
      rawMarkdownBody
    }
  }
}`;

const moduleDetailQueries = `
{
  allModuleMetadataJson {
    nodes {
      id
      fields {
        detailsSlug
      }
      rank
      fullname
      name
      description
    }
  }
}`;

// The free algolia version has limits in place:
//    AlgoliaSearchError: Record at the position 89 objectID=... is too big size=25736 bytes.
//    Contact us if you need an extended quote
// For now we slice each line separately for now, take A-Z lines only, and enable de-duping of objects in Algolia.
// Instead Algolia's docsearch should be investigated and used: https://docsearch.algolia.com/
const splitSearchableStringIntoChunks = (string) => {
  const chunks = string
    .split('\n')
    .flatMap((line) => line.split('.'))
    .map((line) => line.trim())
    .filter(
      (line) =>
        /^[a-zA-Z0-9,' ]+$/.test(line) &&
        line.split(' ').length > 1 &&
        line.length > 5 &&
        line.length < 100
    );
  return chunks;
};

const algoliaQueries = [
  {
    query: wikiQueries,
    indexName: 'Wiki',
    transformer: ({ data }) =>
      data.allMarkdownRemark.nodes.flatMap((node) => {
        const bodyChunks = splitSearchableStringIntoChunks(
          node.rawMarkdownBody
        ).map((line) => {
          return {
            // https://github.com/algolia/gatsby-plugin-algolia/issues/74
            objectID: Math.random(),
            ...node.frontmatter,
            ...node.fields,
            content: line,
          };
        });
        const metadataOnly = {
          // https://github.com/algolia/gatsby-plugin-algolia/issues/74
          objectID: Math.random(),
          ...node.frontmatter,
          ...node.fields,
          content: '',
        };

        const result = bodyChunks.concat(metadataOnly);
        return result;
      }),
    settings: {
      attributeForDistinct: 'slug',
      distinct: true,
    },
  },
  {
    query: moduleDetailQueries,
    indexName: 'Modules',
    transformer: ({ data }) =>
      data.allModuleMetadataJson.nodes.flatMap((node) => {
        const descriptionChunks = splitSearchableStringIntoChunks(
          node.description
        ).map((line) => {
          return {
            // https://github.com/algolia/gatsby-plugin-algolia/issues/74
            objectID: Math.random(),
            slug: node.fields.detailsSlug,
            fullname: node.fullname,
            name: node.name,
            rank: node.rank,
            content: line,
          };
        });

        const metadataOnly = {
          // https://github.com/algolia/gatsby-plugin-algolia/issues/74
          objectID: Math.random(),
          slug: node.fields.detailsSlug,
          fullname: node.fullname,
          name: node.name,
          rank: node.rank,
          content: '',
        };

        const result = descriptionChunks.concat(metadataOnly);
        return result;
      }),
    settings: {
      attributeForDistinct: 'slug',
      distinct: true,
    },
  },
];

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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        defaultLayouts: {
          default: require.resolve('./src/Layout.tsx'),
        },
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1035,
            },
          },
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
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
    // This plugin must be placed last in your list of plugins to ensure that it can query all the GraphQL data
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: algoliaQueries,
        chunkSize: 10000, // default: 1000
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
  /// this must match the path your webpage is displayed from
  pathPrefix: process.env.GATSBY_PATH_PREFIX,
};
