import React from 'react';
import { graphql } from 'gatsby';
import { RootLayout as Layout } from '../Layout';

function ModuleDocumentation({ data }: any) {
  const documentation = data.markdownRemark;
  return (
    <Layout>
      <h2>{documentation.frontmatter.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: documentation.html }} />
    </Layout>
  );
}

export const moduleDocumentationQuery = graphql`
  query ModuleDocumentationQuery($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        root
      }
      html
    }
  }
`;
export default ModuleDocumentation;
