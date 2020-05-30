import React from 'react';
import { graphql } from 'gatsby';
import { WikiLayout } from '../components/layout/WikiLayout';

function WikiTemplate({ data }: any) {
  const article = data.markdownRemark;
  return (
    <WikiLayout>
      <h2>{article.frontmatter.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: article.html }} />
    </WikiLayout>
  );
}

export const wikiQuery = graphql`
  query WikiQuery($id: String) {
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
export default WikiTemplate;
