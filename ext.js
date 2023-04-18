let scrapeEmails=document.getElementById('scrapeEmails');

let list=document.getElementById('emailList');
//Handler to Receive Emails from content script
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
      //Get emails
      let emails=request.emails;
    //   alert(emails); To Check if it is handling emails correctly

    //Display Emails on Popup
    if(emails==null || emails.length==0){
        let li=document.createElement('li');
        li.innerText="Email Not Found";
        list.appendChild(li);
    }
    else{
        emails.forEach((email)=>{
            let li=document.createElement('li');
            li.innerText=email;
            list.appendChild(li);
        })
    }
})

//Button Click Event Listener
scrapeEmails.addEventListener("click",async ()=>{
     //To Get Current Active Tab of our window
     let [tab]=await chrome.tabs.query({active:true,currentWindow:true})
     
     //Many of You might worry what is this script actually this is google chrome console javascript query
     //Execute Script to Scrape Emails on our page
     chrome.scripting.executeScript(
        {
            target:{tabId:tab.id},
            func:scrapeEmailsFromPage,
        }
     )
})

//Function to scrape Emails
function scrapeEmailsFromPage(){
    // alert('hi');
    const emailRegex = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    //Parse mails from HTML of the webpage
    let emails=document.body.innerHTML.match(emailRegex);
    //alert(emails);
    //Send Emails to Popup
    chrome.runtime.sendMessage({emails})
}