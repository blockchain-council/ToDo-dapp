pragma solidity ^0.4.18;


contract ToDo {
    struct Routine { //structure for storing data
        string task;
        string time;    
    }
    event LogTaskAdded(uint id, string task, string time); //logging the event after task gets added.
    
    mapping(uint => Routine) private routines;
    uint[] private ids;

    function getTaskCount() //function for getting all the task counts.
            constant
            returns (uint length) {
        return ids.length;    
    }

    function getTaskIdAt(uint index) //function for getting the task id.
            constant
            returns (uint id) {
        return ids[index];
    }

    function getTask(uint id) //function for getting the task deatail by supplying the task id.
            constant
            returns (string task, string time) {
        Routine storage routine = routines[id];
        return (
            routine.task,
            routine.time);
    }

    function addTask(uint id, string task, string time)//function for adding the task.
            returns (bool successful) {
        routines[id] = Routine({
            task: task,
            time: time
        });
        ids.push(id);
        LogTaskAdded(id, task, time);
        return true;
    }

   
}