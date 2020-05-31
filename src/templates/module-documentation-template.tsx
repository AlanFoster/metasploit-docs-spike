import React from 'react';
import { graphql, Link } from 'gatsby';
import { RootLayout as Layout } from '../components/layout/RootLayout';
import { ModuleDefinition } from './module-definition';
import { Button, Empty, Result, Space, Tooltip, Typography } from 'antd';
const { Title, Text, Paragraph } = Typography;

const MissingModuleDocumentation = ({ module }: any) => {
  const [state, setState] = React.useState('default');

  const onSubmit = () => {
    setState('submitted');
    return false;
  };

  const onCancel = () => {
    setState('default');
    return false;
  };

  if (state === 'submitted') {
    return (
      <Result
        status="success"
        subTitle={
          <React.Fragment>
            <Paragraph>Your request for documentation has been noted</Paragraph>
            <Paragraph>
              A community member may provide this documentation in the future
            </Paragraph>
            <Button type="secondary" onClick={onCancel}>
              Back
            </Button>
          </React.Fragment>
        }
      />
    );
  }

  return (
    <Empty
      description={
        <div>
          <Paragraph>
            No documentation has been written for this module
          </Paragraph>
          <Space direction="horizontal">
            <Tooltip
              title="Know how to run this module? Contribute to the community"
              placement="bottom"
            >
              <Button type="primary">
                <Link to="/wiki/Misc/Writing-Module-Documentation">
                  Contribute documentation
                </Link>
              </Button>
            </Tooltip>
            <Tooltip
              title="Not sure how to run this module? Request documentation for this module"
              placement="bottom"
            >
              <Button onClick={onSubmit} type="secondary">
                Request documentation
              </Button>
            </Tooltip>
          </Space>
        </div>
      }
    />
  );
};

function ModuleDocumentation({ data }: any) {
  const module = data.moduleMetadataJson;
  const documentation = module.documentation;

  return (
    <Layout>
      <ModuleDefinition module={module} activeKey="documentation">
        {!documentation && <MissingModuleDocumentation module={module} />}
        {documentation && (
          <div dangerouslySetInnerHTML={{ __html: documentation.html }} />
        )}
      </ModuleDefinition>
    </Layout>
  );
}

export const moduleDocumentationQuery = graphql`
  query ModuleDocumentationQuery($id: String) {
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
      documentation {
        html
      }
    }
  }
`;
export default ModuleDocumentation;
