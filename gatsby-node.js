/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

// Replacing '/' would result in empty string which is invalid
const replacePath = (path) => (path === `/` ? path : path.replace(/\/$/, ``))

/**
 * Creating wiki pages
 */
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const WikiTemplate = path.resolve(`src/templates/wiki-template.tsx`)
  return graphql(`
    {
      allMdx {
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
      return Promise.reject(result.errors)
    }
    result.data.allMdx.edges.forEach(({ node }) => {
      createPage({
        path: replacePath(node.fields.slug),
        component: WikiTemplate,
        context: { id: node.id }, // additional data can be passed via context
      })
    })
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: replacePath(slug),
    })
  } else if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix
      // value: `/blog${value}`,
      value: replacePath(value),
    })
  }
}

/**
 * Adding additional metadata to the existing data model
 */
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Mdx: {
      breadcrumbs: {
        type: `[String!]!`,
        /**
         * Returns the Breadcrumb trail associated with the given markdown file.
         * Example output: [ 'Contributing', 'Landing-Pull-Requests.md' ]
         */
        resolve(source, args, context, info) {
          const fileAbsolutePath = source.fileAbsolutePath
          const wikiRoot = path.resolve('./contents/wiki')
          const relativeWikiPath = path.relative(wikiRoot, fileAbsolutePath)

          return relativeWikiPath.split(path.sep)
        },
      },
    },
  }
  createResolvers(resolvers)
}
