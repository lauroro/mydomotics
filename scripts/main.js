
prepareDevices();


const addButton = document.getElementById('add-button');
const xClose = document.getElementById('x-close');
const popup = document.getElementById("popup");

addButton.addEventListener('click', function(){
  popup.style.animation = "fadein 1s";
  document.getElementById("popup-container").style.display="block";
});

xClose.addEventListener('click', function(){
  popup.style.animation = "fadeout 1s";
  setTimeout(function(){document.getElementById("popup-container").style.display="none"}, 990);
  document.getElementById("insert-result").textContent = "";
});



const form = document.getElementById('insert-form');
const submit = document.getElementById('submit');

const inputs = document.getElementsByClassName("form-input");
for(var i = 0; i<inputs.length; i++){
  inputs[i].addEventListener("input", function(){
    document.getElementById("insert-result").textContent = "";
  });
}

submit.addEventListener('click', async function(event){
  //Prevent the event from submitting the form, no redirect or page reload
  event.preventDefault();

  const formData = {
    name: form.name.value,
    address: form.address.value,
    action: 'insert'
  }
  //  --------------- INSERT HANDLING ----------------- 
  if(formData["name"] != '' && formData["address"] != '' ){
    const response = await fetch('server/actions.php',
      {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    const data = await response.json();
    if(data["result"] == "done"){
      document.getElementById("insert-result").textContent = "Done!";
      populate(data["item"]);
    }
  }
});


async function prepareDevices(){
  //-------------- LOAD HANDLING --------------------
  let request = {
    action: 'load'
  };
  const response = await fetch('server/actions.php', 
    {
      method: 'POST',
      body: JSON.stringify(request)
    });
  const data = await response.json();
  const items = data["items"];


  let i = 0;
  for (const obj in items){
    i++;
    setTimeout(function(){
      populate(items[obj])},250*i);
  }
}

async function populate(item){
  const devicesBlock = document.getElementById("devices-block");
  const devRow = document.createElement("div");
  devRow.setAttribute('id', 'dev-row');
  const itemButton = document.createElement("button");
  const headingThree = document.createElement("h3");
  const textName = document.createTextNode(item["name"]);
  headingThree.appendChild(textName);
  const lineBreak = document.createElement("br");
  const textAddress = document.createTextNode("@"+item["address"]);
  itemButton.appendChild(headingThree);
  itemButton.appendChild(lineBreak);
  itemButton.appendChild(textAddress);

  const id = "item" + item["id"];
  itemButton.setAttribute('id', id);
  itemButton.style.animation = "summon 1s";
  devRow.appendChild(itemButton);
  devicesBlock.appendChild(devRow);

  document.getElementById(id).addEventListener('click', function(){
    window.open(item["address"],"_self"); 
  });

  //credits to https://github.com/john-doherty/long-press-event
  document.getElementById(id).addEventListener('long-press', function(){
    itemButton.style.animation = "shake 0.2s infinite";
    const clickableArea = document.createElement("div");
    clickableArea.setAttribute("id", "clickable-area");
    clickableArea.style.zIndex = "2";
    document.body.appendChild(clickableArea);

    const delButton = document.createElement("button");
    delButton.setAttribute("id", "del-button");
    delButton.appendChild(document.createElement("h3").appendChild(document.createTextNode("X")));
    delButton.style.zIndex = "3"
    itemButton.parentNode.appendChild(delButton);

    clickableArea.addEventListener("click", function(){
      document.body.removeChild(clickableArea);
      itemButton.parentNode.removeChild(delButton);
      itemButton.style.animation = "";
    });

    delButton.addEventListener("click", async function(){
      document.body.removeChild(document.getElementById("clickable-area"));
      itemButton.parentNode.removeChild(delButton);
      itemButton.style.animation = "";

      request = {
        action: "delete",
        id: item["id"]
      };
      // ------------- DELETE HANDLING ----------------
      const response = await fetch('server/actions.php', 
        {
          method: 'POST',
          body: JSON.stringify(request)
        });
      await response.json();

      itemButton.style.animation = "unsummon 1s";
      setTimeout(function(){
        devRow.parentNode.removeChild(devRow);
      }, 800);
    });
  });
}
