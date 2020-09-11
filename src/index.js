import React, {useContext, useState, useEffect, useRef} from 'react';
import { Table, Divider, Button, Input, Form } from 'antd';
import { render } from 'react-dom';
import './index.css';

const EditableContext = React.createContext();

const { Column, ColumnGroup } = Table;

const EditableRow= ({ index, ...props}) => {
  const [form] = Form.useForm();
  return(
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);

  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(()=>{
    if(editing){
      inputRef.current.focus();
    }
  },[editing]);



const toggleEdit = () => {
  setEditing(!editing);
  form.setFieldsValue({
    [dataIndex]: record[dataIndex],
  });
};

const save = async e => {
  try{
    const values = await form.validateFields();
    toggleEdit();
    handleSave({...record, ...values});
  } catch (errInfo){
    console.log('Save failed:', errInfo)
  }
};

let childNode = children;

if(editable){
  childNode = editing ? (
    <Form.Item
    style={{margin:0,}}
    name={dataIndex}
    rules={[
      {
        required:true,
        message: `${title} is required`,
      }
    ]}>
      <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    </Form.Item>
  ) : (
    <div
      className="editable-cell-value-wrap"
      style={{
        paddingRight: 24,
      }}
      onClick = {toggleEdit}
    >
      {children}
    </div>
  );
}
return <td {...restProps}>{childNode}</td>
}

class EditableTable extends React.Component{

  constructor(props){
    super(props);

  this.state = {selectedRows: []};
  this.columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    // editable: true
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
  title: "Office Phone",
  dataIndex: "phone_office",
  },
  {
    title: "Cell Phone",
    dataIndex: "phone_cell",
    editable: true
  }  
  ];
  this.state = {
    dataSource: [
    {
      key: 1,
      id: 501,
      name: 'Khali Zhang',
      location: "Shanghai",
      office: 'C-103',
      phone_office: 'x55778',
      phone_cell: '650-353-1239',
    }, 
  ],
  count: 1,
  selectedRows: []
  }; 
  }


  handleDelete = () => {
    const dataSource = [...this.state.dataSource];
    console.log("dataSource:", dataSource)
    console.log("selectedRows:")
    console.log(this.state.selectedRows)
    this.setState({
        dataSource: dataSource.filter(item => !this.state.selectedRows.includes(item.key))
    });
  };

    // eslint-disable-next-line no-undef
    handleAdd = () => {
      const { count, dataSource } = this.state;
      const newData = {
        key: count + 1,
        id: dataSource[count-1].id + 1,
        name: '',
        location: '',
        office: '',
        phone_office: '',
        phone_cell: '',
      }

      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1
      })
    }

  handleSave = row => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index];

    newData.splice(index, 1, {...item, ...row});
    this.setState({
      dataSource: newData,
    })
  }

  render(){
    const { dataSource } = this.state;
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    
    const components = {
      body:{
        row: EditableRow,
        cell: EditableCell,
      }
    }

    return (
    <div>
      <Divider />
      <Table
        components={components}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
              selectedRows: [selectedRowKeys]
            })
            // console.log("state:", this.state)
          },
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      >
      </Table>
      <Divider />
      <Button type="primary" onClick={this.handleAdd}>Add</Button>
      <Button type="primary" onClick={this.handleDelete}>Delete</Button>
      <Button type="primary">Update</Button>
    </div>
  );
  }

};

// ReactDOM.render(<Demo />, mountNode);

render(<EditableTable />, document.getElementById('root'));