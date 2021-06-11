setInterval(notify, 1000);

setInterval(get, 1000);

    let todos = [];
    let a=[];



    const pushTodos = ({tslTodos = []}) => {
      tslTodos.forEach((entry)=>{
        
        a.push(entry);
      });
    }
    
    function get()
    {
       
      const gettingItem = browser.storage.sync.get('tslTodos');
      gettingItem.then(async (res) => {
        const localResult = await browser.storage.local.get('tslTodos') || {};
        if(localResult.tslTodos) {
          a=[];
          pushTodos(localResult);
   
        }
        a=[];
        pushTodos(res);
      });

  
    }
    
      function notify(){



        var current;
        var difference;
        var j;

        for( j=0;j<a.length;j++)
        {
          var str = JSON.stringify(a[j].task);
          var number = str.replace(/[^0-9]/g,'');
          var timeSet = number.slice(number.length - 4);

          var date = new Date;

          var m = date.getMinutes().toString();
          var h = date.getHours().toString();
          var s=date.getSeconds().toString();

          var h1;
          var m1;
          
          for(var i=0;i<10;i++)
          {
          
           if(m==i)
           {
             m="0"+m;
           }
          }
         h1 = (timeSet.charAt(0) + timeSet.charAt(1)) * 60;
         m1 = timeSet.charAt(2) + timeSet.charAt(3);
         timeSet = parseInt(h1) + parseInt(m1);
         current= parseInt(h*60)+ parseInt(m);
        
    
            difference = timeSet - current;
      
    
            switch (difference) {
              case 0: if(s==10)
                      {
                    
                      browser.notifications.create({
                        "type": "basic",
                        "title": JSON.stringify(a[j].task),
                        "iconUrl": browser.runtime.getURL("icons/red.png"),
                        //"message": JSON.stringify(date.getHours()) + " and " + JSON.stringify(date.getMinutes())
                        "message": JSON.stringify(timeSet) + " - " + JSON.stringify(current) + " = " + JSON.stringify(difference),
                      });
                    }
                    break;
                
              case 15: 
                    if(s==10)
                    {
                  
                    browser.notifications.create({
                      "type": "basic",
                      "title": JSON.stringify(a[j].task),
                      "iconUrl": browser.runtime.getURL("icons/yellow.png"),
                      //"message": JSON.stringify(date.getHours()) + " and " + JSON.stringify(date.getMinutes())
                      "message": JSON.stringify(timeSet) + " - " + JSON.stringify(current) + " = " + JSON.stringify(difference),
                    });
                  }
                  break;
              
                  case 30: 
                    if(s==10)
                    {
                  
                    browser.notifications.create({
                      "type": "basic",
                      "title": JSON.stringify(a[j].task),
                      "iconUrl": browser.runtime.getURL("icons/green.png"),
                      //"message": JSON.stringify(date.getHours()) + " and " + JSON.stringify(date.getMinutes())
                      "message": JSON.stringify(timeSet) + " - " + JSON.stringify(current) + " = " + JSON.stringify(difference),
                    });
                  }
                  break;
            }
        }

      
            
          
      }