import React from 'react';
import { graphql, StaticQuery, Link } from 'gatsby';
import { Layout, Menu } from 'antd';
import 'antd/lib/menu/style/css';
import './sidebar.css';

const { Sider, Content, Header } = Layout;
const { SubMenu } = Menu;
const pathPrefix = process.env.GATSBY_PATH_PREFIX || '';

interface LinkItem {
  id: string;
  name: string;
  link: string;
}

interface ParentItem {
  id: string;
  name: string;
  items: MenuItem[] | null;
}

type MenuItem = LinkItem | ParentItem;

type Query = { allSidebarJson: { edges: { node: MenuItem }[] } };

function isLinkItem(item: MenuItem): item is LinkItem {
  const result = Boolean((item as LinkItem).link);
  return result;
}

function render(item: MenuItem, id: string) {
  if (isLinkItem(item)) {
    return (
      <Menu.Item
        key={item.link}
        className="sidebar-menu-item"
        style={{ height: 'auto' }}
      >
        <Link to={item.link}>
          <div>{item.name}</div>
        </Link>
      </Menu.Item>
    );
  } else {
    return (
      <Menu.SubMenu key={id} title={item.name}>
        {item.items && item.items.map((v, i) => render(v, id + '.' + i))}
      </Menu.SubMenu>
    );
  }
}

export function Sidebar() {
  return (
    <StaticQuery
      query={graphql`
        query MyQuery {
          allMarkdownRemark {
            edges {
              node {
                id
                fileAbsolutePath
                breadcrumbs
                frontmatter {
                  title
                  ignored
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={(data: Query) => {
        // const rootItems = data.allSidebarJson.edges.map((v) => v.node)
        const menuDataHash = data.allMarkdownRemark.edges
          .map((edge) => edge.node)
          .reduce((acc, node) => {
            if (node.frontmatter.ignored) {
              return acc;
            }

            const menuItem = node.breadcrumbs[1].replace(/-/g, ' ');
            acc[menuItem] = acc[menuItem] || {
              id: menuItem,
              name: menuItem,
              link: '',
              items: [],
            };
            acc[menuItem].items.push({
              name: node.frontmatter.title,
              link: node.fields.slug,
            });
            return acc;
          }, {});
        // Hack for now; Super brittle and doesn't support recursive menus etc.
        const preferredOrder = [
          'Getting Started',
          'Contributing',
          'Metasploit Development',
          'Resources',
          'Misc',
        ];
        const rootItems = preferredOrder.map(
          (menuName) => menuDataHash[menuName]
        );

        const currentPath =
          typeof window !== 'undefined'
            ? window.location.pathname.replace(pathPrefix, '')
            : '/';
        const defaultOpenKeys = rootItems.map((item) => item.id);

        return (
          <Sider
            width={280}
            className="sider"
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={defaultOpenKeys}
              selectedKeys={[currentPath]}
            >
              {rootItems.map((v) => render(v, v.id))}
            </Menu>
          </Sider>
        );
      }}
    />
  );
}
