import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql, Link } from 'gatsby';
import { AutoComplete, Input, Layout, Menu } from 'antd';
import { Logo } from './Logo';
import { Sidebar } from './sidebar';
import { Search } from '../Search';
import 'prismjs/themes/prism-coy.css';
import './Layout.css';

const { Sider, Content, Header } = Layout;

const pathPrefix = process.env.GATSBY_PATH_PREFIX || '';

export function WikiLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQueryWikiLayout {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => {
        const currentPath =
          typeof window !== 'undefined'
            ? window.location.pathname.replace(pathPrefix, '')
            : '/';
        const menuSection = currentPath.split('/')[1];

        return (
          <Layout>
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: 'Sample' },
                { name: 'keywords', content: 'sample, something' },
              ]}
            >
              <html lang="en" />
            </Helmet>

            <Header className="header">
              <div className="logo">
                <Link to="/">
                  <Logo />
                </Link>
              </div>

              <div className="header-search">
                <Search />
              </div>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[menuSection]}
              >
                <Menu.Item key="wiki">
                  <Link to="/wiki">
                    <div>Wiki</div>
                  </Link>
                </Menu.Item>
                <Menu.Item key="modules">
                  <Link to="/modules/explore">
                    <div>Modules</div>
                  </Link>
                </Menu.Item>
                <Menu.Item key="help">
                  <Link to="/help">
                    <div>Help</div>
                  </Link>
                </Menu.Item>
              </Menu>
            </Header>

            <Layout className="content-wrapper">
              <Sidebar />
              <Layout style={{ padding: '0 24px 24px', marginLeft: '280px' }}>
                <Content
                  style={{
                    padding: 24,
                    margin: '24px 0',
                    minHeight: 'inherit',
                    backgroundColor: '#fff',
                  }}
                >
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Layout>
        );
      }}
    />
  );
}

export default WikiLayout;
