import React from 'react';
import { graphql, Link } from 'gatsby';
import { RootLayout as Layout } from '../components/layout/RootLayout';
import { ModuleDefinition } from './module-definition';
import { Button, Empty, Result, Space, Tooltip, Typography } from 'antd';
const { Title, Text, Paragraph } = Typography;

function ModuleReferences({ data }: any) {
  const module = data.moduleMetadataJson;

  return (
    <Layout>
      <ModuleDefinition module={module} activeKey="references">
        <ul>
          {module.references.map(function (reference) {
            return (
              <li key={reference}>
                <a
                  href={reference}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  {reference}
                </a>
              </li>
            );
          })}
        </ul>
      </ModuleDefinition>
    </Layout>
  );
}

export const moduleReferencesQuery = graphql`
  query ModuleReferencesQuery($id: String) {
    moduleMetadataJson(id: { eq: $id }) {
      id
      name
      fullname
      description
      rank
      fields {
        detailsSlug
        documentationSlug
        referencesSlug
      }
      references
    }
  }
`;
export default ModuleReferences;
