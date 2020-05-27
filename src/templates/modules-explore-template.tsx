import React from 'react';
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
import _ from 'lodash';
import { Link } from 'gatsby';
import RootLayout from '../Layout';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const NavigationBreadcrumb = ({ path }) => {
  return (
    <Breadcrumb style={{ margin: '16px' }}>
      <Breadcrumb.Item>
        <Link to="/modules/explore">
          <HomeOutlined /> <span>Modules</span>
        </Link>
      </Breadcrumb.Item>
      {path.split('/').map((segment, index, array) => {
        const currentPath = array.slice(0, index + 1).join('/');
        return (
          <Breadcrumb.Item key={index}>
            <Link to={`/modules/explore/${currentPath}`}>{segment}</Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

function ModuleExplorer({ pageContext }: any) {
  const children = pageContext.children.sort((a, b) =>
    a.segment.localeCompare(b.segment)
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'segment',
      key: 'segment',
      width: '50%',
      render: (segment, item) => (
        <Link to={item.slug}>
          {item.type === 'folder' ? <FolderFilled /> : <FileOutlined />}{' '}
          {segment}
        </Link>
      ),
    },
    {
      title: 'Modules',
      dataIndex: 'moduleCount',
      key: 'moduleCount',
      width: '50%',
      render: (count) => <Text>{count}</Text>,
    },
  ];

  return (
    <RootLayout>
      <NavigationBreadcrumb path={pageContext.fullPath} />
      <Content style={{ marginTop: '24px 16px' }}>
        <Table pagination={false} dataSource={children} columns={columns} />
      </Content>
    </RootLayout>
  );
}

export default ModuleExplorer;
