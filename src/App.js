import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class RenderTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTaskInfo: this.props.currentTask  
    }
  }

  componentDidMount () {
    console.log('Mounted')
  }

  clickItem() {
    // render rest
    console.log('Clicked')
    // console.log(this.state.currentTaskInfo)
    const state = this.state
    state.currentTaskInfo.taskName = 'newName'
    this.setState(state)
    // console.log(this)
  }

  deleteTask () {
    console.log('d e l e t t h i s')
    // console.log(this.props.currentTask._id)
    
    axios.delete(`http://localhost:3000/task/${this.props.currentTask._id}`, { taskId:this.props.currentTask._id })
    .then((res) => {
      // handle result
      // console.log('res------\n',res)
      if(res.data.status === 'success') {
        console.log('Task deleted!')
        // re-Render allTasks
        // pending
        const state = this.state

      }
      else {
        // handle error
        console.log('Error deleting task!')
      }
    });
    this.props.onChange()
  }

  render () {
    return (
        <li key={this.props.id} className='task-list'>
          <span className='field task-name' onClick={this.clickItem.bind(this)}>{this.props.currentTask.taskName}</span>
          {/* <span className='field assign-to'>{this.props.currentTask.assignTo}</span> */}
          <span className='field due-date'>{this.props.currentTask.dueDate}</span>
          <span className='field desc'>{this.props.currentTask.desc}</span>
          <span><button onClick={this.deleteTask.bind(this)}>Delete</button></span>
        </li>
    )
  }
}

class Tasks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      taskList: []
    }
  }
  
  render () {
    return (
      <div id='allTasks'>
        <h2>All tasks</h2>
        <ul>
        {
          this.props.value.map(current =>
            <RenderTask key={current._id} currentTask={current} onChange={this.props.onChange} />
          )
        }
        </ul>
      </div>
    )
  }
}

class TaskForm extends Component {
  constructor() {
    super()
    this.state = {
      taskName: '',
      assignTo: '',
      dueDate: '',
      desc: ''
    }
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  onSubmit = (e) => {
    console.log('Submitted')
    e.preventDefault()
    const { taskName, assignTo, dueDate, desc } = this.state

    axios.post('http://localhost:3000/task', { taskName, assignTo, dueDate, desc })
    .then((res) => {
      // handle result
      if(res.data.status === 'success') {
        console.log('Task added! - ', taskName)
        // re-Render allTasks
      }
      else {
        // handle error
        console.log('Error adding task!')
      }
    });
    this.props.onChange();
  }

  render() {
    const { taskName, assignTo, dueDate, desc } = this.state
    return (
      <div>
        <h2>create task</h2>
        <form onSubmit={this.onSubmit}>
          <input type='text' name='taskName' value={taskName} onChange={this.onChange} placeholder='Name'/>
          <input type='text' name='assignTo' value={assignTo} onChange={this.onChange} placeholder='Assign to'/>
          <input type='text' name='dueDate' value={dueDate} onChange={this.onChange} placeholder='Due Date'/>
          <input type='textarea' name='desc' value={desc} onChange={this.onChange} placeholder='Description'/>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }
}

class TaskListAndForm extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      taskList: []
    }
  }

  loadData() {
    axios.get(`http://localhost:3000/tasks`)
    .then(res => {
      if (res.data.status !== 'success') {
        // handle Error
      } else {
        const taskList = res.data.data.map(currentTask => {
          return currentTask
        })

        this.setState({
          taskList
        })
      }
    })
  }

  componentDidMount () {
    this.loadData()
  }

  onChange () {
    console.log('onChange')
    this.componentDidMount()
  }

  onDelete () {
    console.log('onDelete')
    this.componentDidMount()
  }

  render() {
    return (
    <div>
      <TaskForm onChange={this.onChange.bind(this)} />
      <Tasks value={this.state.taskList} onChange={this.onDelete.bind(this)} />
    </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <TaskListAndForm />
    )
  }
}

export default App
