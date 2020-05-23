/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

// Replacing '/' would result in empty string which is invalid
const replacePath = (path) => (path === `/` ? path : path.replace(/\/$/, ``));

/**
 * Adding slug metadata to nodes on creation
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `src/pages` });
    createNodeField({
      node,
      name: `slug`,
      value: replacePath(slug),
    });
  }
};

/**
 * Creating pages
 */
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const isWiki = node.fields.slug.indexOf("/wiki") === 0;
      const template = isWiki
          ? path.resolve(`src/templates/wiki-template.tsx`)
          : path.resolve(`src/templates/module-documentation-template.tsx`);
      createPage({
        path: replacePath(node.fields.slug),
        component: template,
        context: { id: node.id }, // additional data can be passed via context
      });
    });
  });
};

/**
 * Adding additional metadata to the existing data model
 */
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MarkdownRemark: {
      breadcrumbs: {
        type: `[String!]!`,
        /**
         * Returns the Breadcrumb trail associated with the given markdown file.
         * Example output: [ 'Contributing', 'Landing-Pull-Requests.md' ]
         */
        resolve(source, args, context, info) {
          const fileAbsolutePath = source.fileAbsolutePath;
          const contentRoot = path.resolve('./contents');
          const relativeWikiPath = path.relative(contentRoot, fileAbsolutePath);

          return relativeWikiPath.split(path.sep);
        },
      },
    },
  };
  createResolvers(resolvers);
};
