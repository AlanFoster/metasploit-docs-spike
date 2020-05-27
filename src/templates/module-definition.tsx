import React from 'react';
import { PageHeader, Tag, Tooltip, Layout, Menu, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Content } = Layout;
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'gatsby';
import { Rank } from '../components/rank';

const ModuleContent = ({ children }: any) => {
  return (
    <Layout style={{ padding: '24px 0', backgroundColor: '#fff' }}>
      <Content style={{ padding: '0 24px', minHeight: '200px' }}>
        {children}
      </Content>
    </Layout>
  );
};

const ModuleBreadcrumb = ({ module }) => {
  return (
    <Breadcrumb style={{ margin: '16px' }}>
      <Breadcrumb.Item>
        <Link to="/modules/explore">
          <HomeOutlined /> <span>Modules</span>
        </Link>
      </Breadcrumb.Item>
      {module.fullname.split('/').map((segment, index, array) => {
        const currentPath = array.slice(0, index + 1).join('/');
        const isFolderSegment = index !== array.length - 1;
        return (
          <Breadcrumb.Item key={index}>
            <Link
              to={
                isFolderSegment
                  ? `/modules/explore/${currentPath}`
                  : `/modules/details/${currentPath}`
              }
            >
              {segment}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export const ModuleDefinition = ({ module, activeKey, children }: any) => {
  return (
    <React.Fragment>
      <ModuleBreadcrumb module={module} />
      <PageHeader
        className="site-page-header-responsive"
        title={module.name}
        tags={[<Rank rank={module.rank} />]}
      >
        <Menu selectedKeys={activeKey} mode="horizontal">
          <Menu.Item key="documentation">
            <Link to={module.fields.documentationSlug}>
              <FileTextOutlined /> Documentation
            </Link>
          </Menu.Item>
          <Menu.Item key="details">
            <Link to={module.fields.detailsSlug}>
              <SettingOutlined /> Details
            </Link>
          </Menu.Item>
        </Menu>

        <ModuleContent>{children}</ModuleContent>
      </PageHeader>
    </React.Fragment>
  );
};
