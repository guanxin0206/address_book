import React from 'react';
import { Table, Divider, Button } from 'antd';
import { render } from 'react-dom';
import './index.css';

const { Column, ColumnGroup } = Table;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title: 'Office',
    dataIndex: 'office',
  },
   {
    title: 'Phone',
      children: [
         {
          title: "Office",
          dataIndex: "phone_office",
          
        },
         {
          title: "Cell",
          dataIndex: "phone_cell",
          
        }
      ]
  },
];
const data = [
  {
    key: '1',
    id: '501',
    name: 'Khali Zhang',
    location: "Shanghai",
    office: 'C-103',
    phone_office: 'x55778',
    phone_cell: '650-353-1239',
  },
]; // rowSelection object indicates the need for row selection

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const Demo = () => {
  // const [selectionType, setSelectionType] = useState('checkbox');
  return (
    <div>

      <Divider />

      <Table
        rowSelection={{
          // type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
      >
        <ColumnGroup title="Name">
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />
        </ColumnGroup>
      </Table>
      <Divider />
      <Button type="primary">test</Button>
    </div>
  );
};

// ReactDOM.render(<Demo />, mountNode);

render(<Demo />, document.getElementById('root'));