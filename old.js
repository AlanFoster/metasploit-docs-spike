import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './App.css';
import Highlighter from 'react-highlight-words';
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
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import {
  UserOutlined,
  SmileOutlined,
  HomeOutlined,
  FolderFilled,
  FileOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import rawModules from './modules_metadata_base.json';
import { ReactComponent as Logo } from './logo.svg';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const modules = Object.values(rawModules).sort((a, b) =>
  a.type.localeCompare(b.type)
);
// .filter(
//   (mod) =>
//     mod.fullname.indexOf("admin/db2/db2rcmd") === -1 &&
//     mod.fullname.indexOf("multi/http/jenkins_xstream_deserialize") === -1
// );
const modulesByFullname = modules.reduce(function (acc, module) {
  acc[module.fullname] = module;
  return acc;
}, {});
// ["auxiliary", "exploit", "post", ... etc ...];
const prefixes = Array.from(
  Object.keys(modulesByFullname)
    .reduce((prefixSet, name) => {
      prefixSet.add(name.split('/')[0]);
      return prefixSet;
    }, new Set())
    .values()
);

const stripPrefix = (s) => {
  for (let i = 0; i < prefixes.length; i++) {
    let prefix = prefixes[i];
    if (s.startsWith(prefix)) {
      return s.substring(prefix.length + 1, s.length);
    }
  }
  return s;
};

const Ranking = {
  Manual: 0,
  Low: 100,
  Average: 200,
  Normal: 300,
  Good: 400,
  Great: 500,
  Excellent: 600,
};

const getRankDetails = (rank) => {
  switch (rank) {
    case Ranking.Manual:
      return {
        title: 'Manual',
        description:
          'The exploit is unstable or difficult to exploit and is basically a DoS. This ranking is also used when the module has no use unless specifically configured by the user',
      };
    case Ranking.Low:
      return {
        title: 'Low',
        description:
          'The exploit is nearly impossible to exploit (or under 50% success rate) for common platforms.\n',
      };
    case Ranking.Average:
      return {
        title: 'Average',
        description:
          'The exploit is generally unreliable or difficult to exploit.\n',
      };
    case Ranking.Normal:
      return {
        title: 'Normal',
        description:
          "The exploit is otherwise reliable, but depends on a specific version and can't (or doesn't) reliably autodetect.\n",
      };
    case Ranking.Good:
      return {
        title: 'Good',
        description:
          'The exploit has a default target and it is the "common case" for this type of software (English, Windows 7 for a desktop app, 2012 for server, etc).\n',
      };
    case Ranking.Great:
      return {
        color: 'green',
        title: 'Great',
        description:
          'The exploit has a default target AND either auto-detects the appropriate target or uses an application-specific return address AFTER a version check.\n',
      };
    case Ranking.Excellent:
      return {
        color: 'green',
        title: 'Excellent',
        description:
          'The exploit will never crash the service. This is the case for SQL Injection, CMD execution, RFI, LFI, etc. No typical memory corruption exploits should be given this ranking unless there are extraordinary circumstances (WMF Escape()).',
      };
  }
};

const Rank = ({ rank }) => {
  const rankDetails = getRankDetails(rank);

  return (
    <Tooltip placement="bottom" title={rankDetails.description}>
      <Tag color={rankDetails.color || 'default'} className="rank">
        {rankDetails.title} Ranking
      </Tag>
    </Tooltip>
  );
};

const filterModules = function (modules, search) {
  return modules
    .filter((module) => {
      return (
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.fullname.toLowerCase().includes(search.toLowerCase()) ||
        module.description.toLowerCase().includes(search.toLowerCase()) ||
        module.author.join(' ').toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => a.fullname.localeCompare(b.fullname));
};

const ModuleDetails = ({ module }) => {
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

  const orderedOptions = _.sortBy(module.options, (option) => !option.required);
  const description = module.description
    .split('\n\n')
    .map((line, index) => <Paragraph key={index}>{line}</Paragraph>);

  return (
    <div>
      <Title level={4}>Description</Title>

      <Paragraph>{description}</Paragraph>

      {/*<Divider/>*/}

      <Title level={4}>Options</Title>

      <Paragraph>
        <Table
          columns={columns}
          dataSource={orderedOptions}
          pagination={false}
        />
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
            {module.notes.sideEffects.map((sideEffect) => {
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
            {module.notes.reliability.map((reliability) => {
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

const ModuleDocumentation = ({ module }) => {
  return <div>testing</div>;
};

const renderTitle = (title, amount) => (
  <span key={title}>
    {title}
    <a
      style={{
        float: 'right',
      }}
      href="https://www.google.com/search?q=antd"
      target="_blank"
      rel="noopener noreferrer"
    >
      {amount}
    </a>
  </span>
);

const renderItem = (module, searchTerm) => ({
  value: module.fullname,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        whiteSpace: 'normal',
      }}
    >
      <Highlighter
        highlightClassName="autocomplete-highlight"
        searchWords={[searchTerm]}
        autoEscape={true}
        textToHighlight={module.name}
      />
      <span>
        <Rank rank={module.rank} />
      </span>
    </div>
  ),
});

const TabContent = ({ children }) => {
  return (
    <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
      <Content style={{ padding: '0 24px', minHeight: '200px' }}>
        {children}
      </Content>
    </Layout>
  );
};

const EmptyModuleDocumentation = ({ module }) => {
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
                <a href="https://github.com/rapid7/metasploit-framework/wiki/Writing-Module-Documentation">
                  Contribute documentation
                </a>
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

const ModuleDefinition = ({ module }) => {
  return (
    <PageHeader
      className="site-page-header-responsive"
      // onBack={() => window.history.back()}
      title={module.name}
      // subTitle="This is a subtitle"
      tags={[<Rank rank={module.rank} />]}
    >
      <div className="card-container">
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Documentation" key="2">
            <TabContent>
              <div style={{ marginTop: '15px' }}>
                <EmptyModuleDocumentation module={module} />
              </div>
            </TabContent>
          </TabPane>
          <TabPane tab="Details" key="1">
            <TabContent>
              <ModuleDetails module={module} />
              {/*<Empty/>*/}
            </TabContent>
          </TabPane>
        </Tabs>
      </div>
    </PageHeader>
  );
};

const ModuleFolders = () => {
  return <div>"howdy module folders"</div>;
};

const ModuleExplorer = () => {
  let params = useParams();
  let { url } = useRouteMatch();
  const path = params.path || '';

  // Otherwise we need to calculate the 'folders' in the module hierarchy
  const fileMap = Object.keys(modulesByFullname).reduce(
    (fileMap, moduleKey) => {
      if (moduleKey.startsWith(path)) {
        const prefixLength = path === '' ? 0 : path.length + '/'.length;
        const fileSegments = moduleKey.substring(prefixLength).split('/');
        const file = fileSegments[0];
        const type = fileSegments.length === 1 ? 'file' : 'folder';
        fileMap[file] = fileMap[file] || { file: file, type: type };
        fileMap[file].segments = fileSegments;
        if (type === 'folder') {
          fileMap[file].count = fileMap[file].count || 0;
          fileMap[file].count++;
        }
      }
      return fileMap;
    },
    {}
  );
  const files = Object.values(fileMap).sort((a, b) =>
    a.file.localeCompare(b.file)
  );
  const columns = [
    {
      title: 'Name',
      dataIndex: 'file',
      key: 'name',
      render: (file, item) => (
        <Link to={`${url}/${file}`}>
          {item.type === 'folder' ? <FolderFilled /> : <FileOutlined />} {file}
        </Link>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'size',
      render: (count) => <Text>{count}</Text>,
    },
  ];

  return (
    <Content style={{ marginTop: '24px 16px' }}>
      <Table pagination={false} dataSource={files} columns={columns} />
    </Content>
  );
};

const Modules = () => {
  let { path } = useParams();

  // If we're at a leaf node, just return the module definition directly
  const selectedModule = modulesByFullname[path];

  return (
    <React.Fragment>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item href="/modules">
          <HomeOutlined />
          <span>Modules</span>
        </Breadcrumb.Item>
        {(path || '').split('/').map((segment, index, array) => {
          const path = '/modules/' + array.slice(0, index + 1).join('/');
          return (
            <Breadcrumb.Item key={index}>
              <a href={path}>{segment}</a>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      {selectedModule ? (
        <ModuleDefinition module={selectedModule} />
      ) : (
        <ModuleExplorer />
      )}
    </React.Fragment>
  );
};

export const App = () => {
  const history = useHistory();
  let defaultSearch = '';
  // defaultSearch = "2wire";
  defaultSearch = 'Jenkins-CI enum';
  const [search, setSearch] = React.useState(defaultSearch || '');

  const filteredModules = filterModules(modules, search);

  const options = prefixes.map(function (prefix) {
    const matchedModules = filteredModules.filter(
      (module) => module.fullname.indexOf(prefix) === 0
    );
    return {
      label: renderTitle(`${prefix} module`, matchedModules.length),
      options: matchedModules.map((module) => {
        return renderItem(module, search);
      }),
    };
  });

  const onSearch = (searchText) => {
    setSearch(searchText);
  };

  const onSelect = (fullname) => {
    history.push(`/modules/${fullname}`);
    setSearch('');
  };

  return (
    <Layout>
      <Header className="header">
        <div className="logo">
          <Logo />
        </div>
        <div className="header-search">
          <AutoComplete
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            style={{
              width: 250,
            }}
            options={options}
            value={search}
            onSelect={onSelect}
            onSearch={onSearch}
          >
            <Input.Search size="large" placeholder={search} />
          </AutoComplete>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">
            Articles
            <Link to="/" />
          </Menu.Item>
          <Menu.Item key="2">
            Modules
            <Link to="/" />
          </Menu.Item>
          <Menu.Item key="3">
            Help
            <Link to="/" />
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '0 50px' }}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/modules" />
          </Route>
          <Route exact path="/articles">
            Articles here
          </Route>
          <Route exact path="/modules/">
            <Modules />
          </Route>
          <Route path="/modules/:path*">
            <Modules />
          </Route>
        </Switch>
      </Content>

      {/*<Footer style={{textAlign: "center"}}>Metasploit spike</Footer>*/}
    </Layout>
  );
};
