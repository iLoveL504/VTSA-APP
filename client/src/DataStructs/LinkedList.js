import tasks from '../data/TasksData.js'

const testArray = [
  {
    id: 500,
    text: "Mechanical Installation (Passenger Elevator)",
    type: "summary",
    start: null,
    end: null,
    duration: 45,
    parent: 0,
    open: true,
  },
  {
    id: 501,
    text: "Unloading of elevator equipments",
    type: "task",
    start: null,
    end: null,
    duration: 1,
    parent: 500,
  },    
  {
    id: 502,
    text: "Unloading of elevator equipments",
    type: "task",
    start: null,
    end: null,
    duration: 1,
    parent: 500,
  }    
]

const addDuration = (start, days) => {
  const date = new Date(start);
  let addedDays = 0;

  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) { // skip Sunday and Saturday
      addedDays++;
    }
  }
  return date;
};


class Node {
    constructor(data, next = null){
        this.data = data;
        this.next = next
    }
}

class LinkedList {
    constructor(date) {
        this.head = null
        this.ScheduleData = []
        this.size = 0
        this.date = new Date(date)
    }

    //generate Id
    generateNewID(parentID) {
        let current = this.head;
        let maxID = parentID; // start from parentID (so if parent=600, maxID=600 initially)

        while (current) {
            if (current.data.parent === parentID) {
                if (current.data.id > maxID) {
                    maxID = current.data.id;
                }
            }
            current = current.next;
        }

        return maxID + 1; // next available ID
    }


    //searchId
    searchID(id) {
        let current = this.head
        if(current.data.id === id){
            return current.data 
        } else if (current.next) {
            while (current.next){
                current = current.next
                if(current.data.id === id){
                    return current.data
                }
            }
        } else return console.log('cannot find id')
    }

    // Insert first node
    insertFirst(data){
        this.head = new Node(data, this.head)
        this.size++
    }


    // insert last node
    insertLast(data) {
        if (!data.id) {
            data.id = this.generateNewID(data.parent || 0);
        }

        let node = new Node(data)
        let current = this.head
        let previous = this.head

        // If empty, make head
        if(!this.head){
            
            const start = new Date(this.date)
            node.data.start = start
            node.data.end = addDuration(node.data.start, node.data.duration)
            this.head = node
        } else {
            while(current.next){
                previous = current
                current = current.next
            }
           
            if(current.data.type === 'summary'){
                node.data.start = current.data.start
                 node.data.end = addDuration(node.data.start, node.data.duration);
                current.next = node
            } else {
                node.data.start = current.data.end
                node.data.end = addDuration(node.data.start, node.data.duration)
                node.data.end = addDuration(node.data.start, node.data.duration)
      
                if(node.data.text === 'Manufacturing and Importation Process (Passenger Elevator)'){
         
                    const foundTask = this.findTask("Structural/Civil Works")
                    node.data.start = foundTask.start
                    node.data.end = foundTask.end
                }
                current.next = node
            }
       
        }

        this.size++
    }

    // insert at index
    insertAt(data, index) {
        if (!data.id) {
            data.id = this.generateNewID(data.parent || 0);
        }

        // If index is out of range
        if(index > 0 && index > this.size) return

        // If first index
        if(index === 0) {
            this.head = new Node(data, this.head)
            node.data.start = new Date(this.date); // base date for head
            node.data.end = addDuration(node.data.start, node.data.duration);
            return
        }

        const node = new Node(data)
        let current, previous

        //Set current to first
        current = this.head
        let count = 0

        while(count < index) {
            previous = current
            count++
            current = current.next
        }
        node.data.start = previous.data.end;
        node.data.end = addDuration(node.data.start, node.data.duration);

    // insert node
        node.next = current;
        previous.next = node;


        let updater = previous.next
    
        while (updater){
            if(previous.data.type === 'summary'){
                updater.data.start = previous.data.start
                updater.data.end = addDuration(updater.data.start, updater.data.duration)
            } else {
                updater.data.start = previous.data.end
                updater.data.end = addDuration(updater.data.start, updater.data.duration)
                
            }
            previous = previous.next
           
            updater = updater.next
        }

        this.size++
    }

    // GetByName
    findTask(task) {
        let current = this.head
        while(current.next){
            if(current.data.text === task){
                return current.data
            } else current = current.next
        }
    }

    // Get at index
    getAt(index) {
        let current = this.head
        let count = 0

        while(current) {
            if(count === index){
                console.log(current.data)
            }
            count++
            current = current.next
        }

        return null
    }

    // Remove at index
    removeAt(index) {
        if(index > 0 && index > this.size) {
            return
        }
        let current = this.head
        let previous
        let count = 0

        if (index === 0) {
            this.head = current.next
        } else {
            while(count < index) {
                count++
                previous = current
                current = current.next
            }

            previous.next = current.next
            let updater = previous.next
            while (updater){
            if(previous.data.type === 'summary'){
                updater.data.start = previous.data.start
                updater.data.end = addDuration(updater.data.start, updater.data.duration)
            } else {
                updater.data.start = previous.data.end
                updater.data.end = addDuration(updater.data.start, updater.data.duration)
                
            }
            previous = previous.next
           
            updater = updater.next
        }

        }
        this.size--
    }

    //Search for specific function

    // Clear list 
    clearList () {
        this.head = null
        this.size = 0
    }

    // Print list data
    printListData() {
        let current = this.head
        let i = 0
        let data = []
        while (current) {
            current.data.start = current.data.start.toLocaleDateString('en-GB')
            current.data.end = current.data.end.toLocaleDateString('en-GB')
            data[i] = current
            i++
            current = current.next
        }
        this.ScheduleData = data
   

        const mappedData = this.ScheduleData.map((t, index) => {
            return t.data
        })
        return mappedData
    }

    toArray() {
        let current = this.head;
        const arr = [];
        while (current) {
        arr.push({ ...current.data }); // shallow copy so React can use it safely
        current = current.next;
        }
        return arr;
    }
}

const ll = new LinkedList(new Date())
tasks.forEach((t) => {
    //ll.insertFirst(t)
    ll.insertLast(t)
})
ll.insertAt( {
    text: "I showspeed",
    type: "task",
    start: null,
    end: null,
    duration: 1,
    parent: 500,
  }, 8)
  ll.removeAt(8)


 //console.log(ll.toArray())



const date = new Date()

export default LinkedList
