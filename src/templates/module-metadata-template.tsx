import React from 'react';
import { graphql } from 'gatsby';
import { RootLayout as Layout } from '../Layout';

function ModuleMetadata({ data }: any) {
  const metadata = data.markdownRemark;
  return (
    <Layout>
      <h2>{metadata.frontmatter.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: metadata.html }} />
    </Layout>
  );
}

export const moduleMetadataQuery = graphql`
  query ModuleMetadataQuery($id: String) {
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
export default ModuleMetadata;
