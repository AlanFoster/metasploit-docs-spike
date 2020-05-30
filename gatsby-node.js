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
  } else if (node.internal.type === `ModuleMetadataJson`) {
    createNodeField({
      node,
      name: `detailsSlug`,
      value: `/modules/details/${node.fullname}`,
    });

    createNodeField({
      node,
      name: `documentationSlug`,
      value: `/modules/documentation/${node.fullname}`,
    });

    createNodeField({
      node,
      name: `referencesSlug`,
      value: `/modules/references/${node.fullname}`,
    });
  }
};

/**
 * Creating pages
 */
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const createWikiPages = new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/contents/wiki/" } }
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        return reject(result.errors);
      }
      const template = path.resolve(`src/templates/wiki-template.tsx`);
      result.data.allMarkdownRemark.nodes.forEach((node) => {
        createPage({
          path: replacePath(node.fields.slug),
          component: template,
          context: { id: node.id }, // additional data can be passed via context
        });
      });
      resolve();
    });
  });

  const createModulePages = new Promise((resolve, reject) => {
    graphql(`
      {
        allModuleMetadataJson {
          nodes {
            id
            fields {
              detailsSlug
              documentationSlug
              referencesSlug
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        return reject(result.errors);
      }
      result.data.allModuleMetadataJson.nodes.forEach((node) => {
        createPage({
          path: node.fields.detailsSlug,
          component: path.resolve(`src/templates/module-details-template.tsx`),
          context: { id: node.id },
        });
        createPage({
          path: node.fields.documentationSlug,
          component: path.resolve(
            `src/templates/module-documentation-template.tsx`
          ),
          context: { id: node.id },
        });
        createPage({
          path: node.fields.referencesSlug,
          component: path.resolve(
            `src/templates/module-references-template.tsx`
          ),
          context: { id: node.id },
        });
      });
      resolve();
    });
  });

  const createModuleExplorerPages = new Promise((resolve, reject) => {
    graphql(`
      {
        allModuleMetadataJson {
          nodes {
            id
            fullname
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        return reject(result.errors);
      }

      const getModuleHierarchy = function () {
        const hierarchy = {
          fullPath: '',
          type: 'folder',
          children: {},
        };

        result.data.allModuleMetadataJson.nodes.forEach((node) => {
          const fullname = node.fullname;
          const nameSegments = fullname.split('/');
          let parentsChildren = hierarchy.children;
          nameSegments.forEach((segment, i) => {
            const currentPath = nameSegments.slice(0, i + 1).join('/');
            const isFolderSegment = i !== nameSegments.length - 1;
            if (isFolderSegment) {
              if (!parentsChildren[segment]) {
                parentsChildren[segment] = {
                  type: 'folder',
                  fullPath: currentPath,
                  children: {},
                };
              }
              parentsChildren = parentsChildren[segment].children;
            } else {
              if (parentsChildren[segment]) {
                throw new Error(`Found duplicate file when merging ${path}`);
              }

              parentsChildren[segment] = {
                type: 'file',
                fullPath: currentPath,
              };
            }
          });
        });

        return hierarchy;
      };

      const countChildModules = function (parent) {
        if (parent.type === 'file') return 1;

        let childModuleCount = 0;
        Object.values(parent.children).forEach((child) => {
          childModuleCount += countChildModules(child);
        });

        return childModuleCount;
      };

      const moduleHierarchy = getModuleHierarchy();
      const createPagesForModuleHierarchy = function (parent) {
        if (parent.type === 'folder') {
          createPage({
            path: `modules/explore/${parent.fullPath}`,
            component: path.resolve(
              `src/templates/modules-explore-template.tsx`
            ),
            context: {
              fullPath: parent.fullPath,
              children: Object.keys(parent.children).map((segment) => {
                const child = parent.children[segment];
                return {
                  segment: segment,
                  slug:
                    child.type === 'folder'
                      ? `modules/explore/${child.fullPath}`
                      : `modules/details/${child.fullPath}`,
                  type: child.type,
                  moduleCount: child.children
                    ? countChildModules(child)
                    : undefined,
                };
              }),
            },
          });

          Object.values(parent.children).forEach(createPagesForModuleHierarchy);
        }
      };

      createPagesForModuleHierarchy(moduleHierarchy);
      resolve();
    });
  });

  return Promise.all([
    createWikiPages,
    createModulePages,
    createModuleExplorerPages,
  ]);
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
      moduleMetadataJson: {
        type: 'ModuleMetadataJson',
        resolve(source, args, context, info) {
          const documentationFolder = path.resolve(
            './contents/modules/documentation'
          );
          if (source.fileAbsolutePath.indexOf(documentationFolder) !== 0) {
            return null;
          }

          const requiredModule = path
            .relative(documentationFolder, source.fileAbsolutePath)
            .replace(/.md$/, '');
          return context.nodeModel.runQuery({
            query: {
              filter: {
                fullname: { eq: requiredModule },
              },
            },
            type: 'ModuleMetadataJson',
            firstOnly: true,
          });
        },
      },
    },
    ModuleMetadataJson: {
      documentation: {
        type: 'MarkdownRemark',
        resolve(source, args, context, info) {
          // Example value: 'exploit/windows/smb/ms17_010_eternalblue'
          const moduleName = source.fullname;
          const expectedDocumentationPath = path.join(
            path.resolve('./contents/modules/documentation'),
            `${moduleName}.md`
          );
          return context.nodeModel.runQuery({
            query: {
              filter: {
                fileAbsolutePath: { eq: expectedDocumentationPath },
              },
            },
            type: 'MarkdownRemark',
            firstOnly: true,
          });
        },
      },
    },
  };
  createResolvers(resolvers);
};
