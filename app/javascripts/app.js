// Import the page's CSS.
import '../stylesheets/app.css'

// Import Web3 libraries.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import todoArtifacts from '../../build/contracts/ToDo.json'

// ToDo is our usable abstraction, which we'll use through the code below.
let ToDo = contract(todoArtifacts)


let accounts
let account
let pressed = false

window.App = {
  start: function () {
    // Bootstrap the ToDo abstraction for Use.
    ToDo.setProvider(web3.currentProvider) // Geting the initial account balance.
    this.getAccountsPromise()
      .then(accs => this.getAccounts(accs))
      .catch(err => alert('There was an error fetching your accounts.')) //Produce an error if there is no account present.
  },

  getAccountsPromise: function () { //function for getting the account promise.
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((e, accounts) => {
        if (e != null) {
          reject(e)
        } else {
          resolve(accounts)
        }
      })
    })
  },

  getAccounts: function (accs) {
    if (accs.length === 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
      return
    }

    accounts = accs
    account = accounts[0]

    this.addRowWatch()
    this.collectTasks()
  },

  addRowWatch: function () {
    ToDo.deployed()
      .then(instance => instance.LogTaskAdded().watch((error, result) => this.addRowButtonPressed(error, result)))
  },

  addRowButtonPressed: function (error, result) {
    if (!error && pressed) {
      this.addRow(result.args.id, result.args.task, result.args.time)
      pressed = false
    }
  },

  collectTasks: function () {
    ToDo.deployed()
      .then(instance => instance.getTaskCount())
      .then(count => this.collectTasksIfPresent(count))
      .catch(e => console.error(e))
  },

  collectTasksIfPresent: function (count) {
    if (count.valueOf() > 0) {
      for (let i = 0; i < count.valueOf(); i++) {
        this.getTaskIdAt(i)
      }
    }
  },

  getTaskIdAt: function (i) {
    ToDo.deployed()
      .then(instance => instance.getTaskIdAt(i))
      .then(id => this.getTask(id))
      .catch(e => console.error(e))
  },

  getTask: function (id) {
    ToDo.deployed()
      .then(instance => instance.getTask(id.valueOf()))
      .then(values => this.addRow(id, values[0], values[1]))
      .catch(e => console.error(e))
  },

  addRow: function (id, task, time) {
    let tableRef = document.getElementById('taskTable').getElementsByTagName('tbody')[0]

    // Insert a row in the table at the last row
    let newRow = tableRef.insertRow(tableRef.rows.length)

    // Insert a cell in the row at index 0
    let newIdCell = newRow.insertCell(0)
    let newTaskCell = newRow.insertCell(1)
    let newTimeCell = newRow.insertCell(2)

    // Append a text node to the cell
    let newId = document.createTextNode(id.toNumber())
    let newTask = document.createTextNode(task)
    let newTime = document.createTextNode(time)


    newIdCell.appendChild(newId)
    newTaskCell.appendChild(newTask)
    newTimeCell.appendChild(newTime)

    document.getElementById('id').value = ''
    document.getElementById('task').value = ''
    document.getElementById('time').value = ''
  },

  addTask: function () {
    ToDo.deployed()
      .then(instance => this.addTaskWithFormData(instance))
      .then(tx => console.log(tx.logs[0].args))
      .catch(e => console.error(e))
  },

  addTaskWithFormData: function (instance) {
    pressed = true
    let newId = parseInt(document.getElementById('id').value)
    let newTask = document.getElementById('task').value
    let newTime = document.getElementById('time').value
    return instance.addTask(newId, newTask, newTime, { from: account, gas: 3000000 })
  },
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  App.start()
})
