import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql, Link } from 'gatsby'
import { pathPrefix } from '../gatsby-config'
import { AutoComplete, Input, Layout, Menu } from 'antd'
import { Logo } from './Logo'
import './Layout.css'
import { Sidebar } from './sidebar'

const { Sider, Content, Header } = Layout

export function RootLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
          allMdx {
            edges {
              node {
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={(data) => {
        const allPosts = data.allMdx.edges.map(
          (edge: any) => edge.node.fields.slug
        )
        let onPostPage
        if (typeof window !== 'undefined') {
          const path = window.location.pathname.replace(
            pathPrefix.slice(0, -1),
            ''
          )
          if (
            allPosts.indexOf(path) >= 0 ||
            allPosts.indexOf(path.slice(0, -1)) >= 0
          ) {
            onPostPage = true
          } else {
            onPostPage = false
          }
        }

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

              {/*<div className="header-search">*/}
              {/*  <AutoComplete*/}
              {/*      dropdownClassName="certain-category-search-dropdown"*/}
              {/*      dropdownMatchSelectWidth={500}*/}
              {/*      style={{*/}
              {/*        width: 250,*/}
              {/*      }}*/}
              {/*      options={options}*/}
              {/*      value={search}*/}
              {/*      onSelect={onSelect}*/}
              {/*      onSearch={onSearch}*/}
              {/*  >*/}
              {/*    <Input.Search size="large" placeholder={search} />*/}
              {/*  </AutoComplete>*/}
              {/*</div>*/}
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['wiki']}
              >
                <Menu.Item key="/wiki">
                  <Link to="/wiki">
                    <div>Wiki</div>
                  </Link>
                </Menu.Item>
                <Menu.Item key="modules">
                  <Link to="/modules">
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

            <Layout>
              <Sidebar />
              <Layout style={{ padding: '0 24px 24px', marginLeft: '256px' }}>
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
        )

        // return (
        //   <div style={{ width: '100%', padding: 0, overflow: 'hidden' }}>

        //     <div
        //       style={{
        //         display: 'grid',
        //         gridTemplateColumns: 'auto 1fr auto',
        //         height: '100%',
        //       }}
        //     >
        //       <Sidebar root={sidebarRoot} />
        //       <Layout>
        //         <Content
        //           style={{
        //             background: '#fff',
        //             padding: 24,
        //             margin: 0,
        //           }}
        //         >
        //           {children}
        //         </Content>
        //       </Layout>
        //       <TableOfContents />
        //     </div>
        //     <Layout>
        //       <Sider
        //         width={200}
        //         style={{ background: '#fff', height: '100%' }}
        //       />
        //     </Layout>
        //   </div>
        // )
      }}
    />
  )
}

export default RootLayout
