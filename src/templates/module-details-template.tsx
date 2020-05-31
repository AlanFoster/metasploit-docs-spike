import React from 'react';
import { graphql } from 'gatsby';
import { RootLayout } from '../components/layout/RootLayout';
import { ModuleDefinition } from './module-definition';
import _ from 'lodash';
import {
  Layout,
  Menu,
  Table,
  Empty,
  Descriptions,
  Tooltip,
  Badge,
  Button,
  Tabs,
  PageHeader,
  Typography,
  Breadcrumb,
  Cascader,
  Input,
  AutoComplete,
  Result,
  Space,
  Tag,
  Divider,
} from 'antd';
import {
  UserOutlined,
  SmileOutlined,
  HomeOutlined,
  FolderFilled,
  FileOutlined,
} from '@ant-design/icons';
import 'antd/lib/table/style/css';
const { Header, Content, Footer, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const OptionsTable = ({ options }: any) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, item) =>
        item.required ? (
          <Tooltip title="required">
            <Text strong>{text}*</Text>
          </Tooltip>
        ) : text ? (
          <Tooltip title="not required">{text}</Tooltip>
        ) : (
          ''
        ),
    },
    {
      title: 'Value',
      dataIndex: 'default',
      key: 'default',
      render: (text) => (text ? <Text code>{`${text}`}</Text> : null),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
    },
  ];

  return <Table columns={columns} dataSource={options} pagination={false} />;
};

const selectOptions = function <T>(
  options: Array<T>,
  filterPredicate: (option: T) => boolean
): Array<T> {
  return _.chain(options)
    .filter(filterPredicate)
    .sortBy((option) => !option.required)
    .value();
};

const ModuleDetails = ({ module }: any) => {
  const description = module.description
    .split('\n\n')
    .map((line, index) => <Paragraph key={index}>{line}</Paragraph>);

  const basicOptions = selectOptions(
    module.options,
    (option) => !(option.advanced || option.evasion)
  );
  const advancedOptions = selectOptions(
    module.options,
    (option) => option.advanced
  );

  return (
    <div>
      <Title level={4}>Description</Title>

      <Paragraph>{description}</Paragraph>

      <Title level={4}>Options</Title>

      <Paragraph>
        <OptionsTable options={basicOptions} />
      </Paragraph>

      <Title level={4}>Advanced Options</Title>

      <Paragraph>
        <OptionsTable options={advancedOptions} />
      </Paragraph>

      <Title level={4}>Authors</Title>

      <Paragraph>
        <ul>
          {module.author.map((author) => {
            return <li key={author}>{author}</li>;
          })}
        </ul>
      </Paragraph>

      <Title level={4}>Side effects</Title>

      <Paragraph>
        {module.notes.sideEffects ? (
          <Text>
            {module.notes.SideEffects.map((sideEffect) => {
              return <div>{sideEffect}</div>;
            })}
          </Text>
        ) : (
          <Text>N/A</Text>
        )}
      </Paragraph>

      <Title level={4}>Reliability</Title>

      <Paragraph>
        {module.notes.reliability ? (
          <Text>
            {module.notes.Reliability.map((reliability) => {
              return <div>{reliability}</div>;
            })}
          </Text>
        ) : (
          <Text>N/A</Text>
        )}
      </Paragraph>

      <Title level={4}>Stability</Title>

      <Paragraph>
        {module.notes.stability ? (
          <Text>
            {module.notes.stability.map((stability) => {
              return <div>{stability}</div>;
            })}
          </Text>
        ) : (
          <Text>N/A</Text>
        )}
      </Paragraph>
      {/*<pre>{JSON.stringify(module, null, 4)}</pre>*/}
    </div>
  );
};

function ModuleMetadata({ data }: any) {
  const metadata = data.moduleMetadataJson;
  return (
    <RootLayout>
      <ModuleDefinition module={metadata} activeKey="details">
        <ModuleDetails module={metadata} />
      </ModuleDefinition>
    </RootLayout>
  );
}

export const moduleMetadataQuery = graphql`
  query ModuleDetailsQuery($id: String) {
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

      author
      notes {
        SideEffects
        Reliability
        Stability
      }
      options {
        advanced
        evasion
        name
        required
        default
        description
      }
    }
  }
`;
export default ModuleMetadata;
