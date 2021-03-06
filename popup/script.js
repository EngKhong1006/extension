let todos = [];

//start

var hours=document.getElementById("hours");
var minutes=document.getElementById("minutes");


var date = new Date;
var m = date.getMinutes();
var h = date.getHours();


function addMinSec(id){
  var select=id;
  var hr=24;

  for(i=h; i<=hr;i++){
    select.options[select.options.length]=new Option(i <10 ? "0" + i :i);
  }

}
addMinSec(hours);

function addMinSec2(id){
  var select=id;
  var min=59;

    for(i=0; i<=min;i=i+5){
    select.options[select.options.length]=new Option(i <10 ? "0" + i :i);
    }
    
}
addMinSec2(minutes);




const pushTodos = ({tslTodos = []}) => {
  tslTodos.forEach((entry)=>{
    todos.push(entry);
  });
}

const gettingItem = browser.storage.sync.get('tslTodos');
gettingItem.then(async (res) => {
  const localResult = await browser.storage.local.get('tslTodos') || {};
  if(localResult.tslTodos) {
    pushTodos(localResult);
    resetMemory();
  }
  pushTodos(res);
  setupTodos();
});

function setupTodos(){
  if(todos.length > 0){
    todos.forEach((entry)=>{
      insertTodo(entry);
    });
    setupBadge();
  }
}

function insertTodo(entry){

      let tempChild = document.createElement('div');
      
      if(entry.done !== 0){
        tempChild.className="IAmDone row";
        
      }else{
        tempChild.className="row";
      }

      tempChild.innerHTML = `<div class="removeTodo">&#x1f5d1;</div><div class="checkTodo">&#x2713;</div><div class="toggleTodo">${entry.task}</div>`;
      tempChild.setAttribute('data-isDone',entry.done);
      tempChild.setAttribute('data-id',entry.key);

      const todosHolder = document.getElementById('todosHolder');
      todosHolder.appendChild(tempChild);
}

function pushIntoStore(obj){
  let len = todos.length + 1;
  let index = "I"+len;

  obj.key = index;
  todos.push(obj);
  return obj;

}

function toggleTodo(ele){
  let parentNode = ele.parentNode;
  let dataId = parentNode.getAttribute('data-id');
  let dataIsDone = parentNode.getAttribute('data-isDone');

  if(parseInt(dataIsDone, 10)!==0){
    parentNode.className = "row";
    parentNode.setAttribute('data-isDone',0);
  }else{
    parentNode.className = "IAmDone row";
    parentNode.setAttribute('data-isDone',1);
  }
  toggleTodoInMemory(dataId,dataIsDone);
}

function removeTodo(ele){

  let parentNode = ele.parentNode;
  let dataId = parentNode.getAttribute('data-id');
  removeTodoFromMemory(dataId);
  parentNode.remove(dataId);  
}

//delete from database
function removeTodoFromMemory(dataId){
    todos = todos.filter((item) => item.key !== dataId);
    resetMemory();
}


function toggleTodoInMemory(dataId,dataIsDone){
  todos = todos.map(entry => {
    if(entry.key == dataId) entry.done = dataIsDone != 1 ? 1:0;
    return entry; 
  });
  resetMemory();
}


//save inside database
function saveToDo() {

  let todoVal = document.getElementsByTagName('textarea')[0].value;
  let todoDate=document.getElementById('hours').value;
  let todoDate2=document.getElementById('minutes').value;


  var b=todoVal+" ("+todoDate+":"+todoDate2+")";



  if(todoVal.trim().length>0){
    obj = pushIntoStore({task:b, done:0});
    insertTodo(obj);
    document.getElementsByTagName('textarea')[0].value = "";
    document.getElementById('hours').value=h;
    resetMemory();
  }
}

function resetMemory() {
  browser.storage.local.clear();
  browser.storage.sync.set({tslTodos:todos});
  setupBadge();
}

//click event
document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.className === 'removeTodo')
    removeTodo(event.target);

  if (event.target.className === 'toggleTodo')
    toggleTodo(event.target);

  if (event.target.className === 'addTask')
    saveToDo();

});

function setupBadge(){
  count = todos.filter((item) => item.done === 0).length;
  if (count > 0)
    browser.browserAction.setBadgeText({text: count.toString()});
    
  else
  browser.browserAction.setBadgeText({text: ''});
}

document.querySelector('textarea').addEventListener('keyup',function(event) {
  if(event.keyCode == 13)
    saveToDo();
});
