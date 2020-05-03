import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./App.css";
import {
    Layout,
    Menu,
    Table,
    Empty,
    Descriptions,
    Tooltip,
    Badge,
    Typography,
    Breadcrumb,
    Cascader,
    Input,
    AutoComplete
} from "antd";
import { UserOutlined } from '@ant-design/icons';
import _ from "lodash";
import rawModules from "./modules_metadata_base.json"
import breadcrumb from "ant-design-pro/lib/PageHeader/breadcrumb";

const {Header, Content, Footer, Sider} = Layout;
const {Text} = Typography;

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                    {
                        value: 'xiasha',
                        label: 'Xia Sha',
                        disabled: true,
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua men',
                    },
                ],
            },
        ],
    },
];
const modules =
    Object.values(rawModules)
        .sort((a, b) => a.type.localeCompare(b.type))
        .filter((mod) => (
                mod.fullname.indexOf('admin/db2/db2rcmd') === -1 &&
                mod.fullname.indexOf('multi/http/jenkins_xstream_deserialize') === -1
            )
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

const filterModules = function (modules, search) {
    return (
        modules
            .filter(module => {
                return (
                    module.name.toLowerCase().includes(search.toLowerCase()) ||
                    module.fullname.toLowerCase().includes(search.toLowerCase()) ||
                    module.description.toLowerCase().includes(search.toLowerCase()) ||
                    module.author.join(" ").toLowerCase().includes(search.toLowerCase())
                );
            })
            .sort((a, b) => a.fullname.localeCompare(b.fullname))
    )
};

const Module = ({module}) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, item) => (
                item.required
                    ? <Tooltip title="required"><Text strong>{text}*</Text></Tooltip>
                    : <Tooltip title="not required">{text}</Tooltip>
            ),
        },
        {
            title: 'Value',
            dataIndex: 'default',
            key: 'default',
            render: text => <Text code>{text}</Text>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'Description',
        }
    ];

    const orderedOptions = _.sortBy(module.options, (option) => !option.required);
    const description = module.description.split("\n\n").map((line, index) => <div key={index}>{line}</div>);

    return (
        <div>
            <div style={{marginBottom: '1em'}}>
                <Breadcrumb>
                    {
                        module.fullname.split("/").map((segment, index) =>{
                            return (
                                <Breadcrumb.Item key={index}>
                                    <a href="">{segment}</a>
                                </Breadcrumb.Item>
                            )
                        })
                    }
                </Breadcrumb>
            </div>

            <div className="site-layout-background" style={{padding: 24}}>
                <Descriptions title={module.name} layout="vertical" bordered>
                    <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
                    <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
                    <Descriptions.Item label="Usage Time" span={2}>
                        2019-04-24 18:00:00
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                        <Badge status="processing" text="Running"/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
                    <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
                    <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
                    <Descriptions.Item label="Config Info">
                        {description}
                    </Descriptions.Item>
                </Descriptions>

                <Table
                    columns={columns}
                    dataSource={orderedOptions}
                    pagination={false}
                />

                <pre>
                {JSON.stringify(module, null, 4)}
            </pre>
            </div>
        </div>
    )
};

const prefixes = [
    'auxiliary',
    'exploit',
    'post'
];

export const App = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(4);
    let defaultSearch = '';
    // defaultSearch =  'jenkins';
    const [search, setSearch] = React.useState(defaultSearch || "");

    const filteredModules = (
        filterModules(modules, search)
    );

    const selectedModule = filteredModules[selectedIndex];

    function onChange(value, selectedOptions) {
        console.log(value, selectedOptions);
    }

    function filter(inputValue, path) {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    return (
        <Layout>
            {/*<Sider*/}
            {/*    style={{*/}
            {/*        overflow: "auto",*/}
            {/*        height: "100vh",*/}
            {/*        position: "fixed",*/}
            {/*        left: 0*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Cascader*/}
            {/*        options={options}*/}
            {/*        onChange={onChange}*/}
            {/*        placeholder="Please select"*/}
            {/*        showSearch={{ filter }}*/}
            {/*    />*/}

            {/*    <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>*/}
            {/*        {*/}
            {/*            filteredModules.map((module) => {*/}
            {/*                return (*/}
            {/*                    <Menu.Item key={module.fullname}>*/}
            {/*                        {stripPrefix(module.fullname)}*/}
            {/*                    </Menu.Item>*/}
            {/*                )*/}
            {/*            })*/}
            {/*        }*/}
            {/*    </Menu>*/}
            {/*</Sider>*/}



            <Layout className="site-layout" >
                {/*style={{marginLeft: 200}}>*/}
                <Header className="site-layout-background" style={{padding: 0}}/>
                <Content style={{margin: "24px 16px 0", overflow: "initial"}}>
                    <Module
                        module={selectedModule}
                    />
                    <Empty/>
                </Content>
                <Footer style={{textAlign: "center"}}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
