var defaultBotToken = 'Set your telegram bot token';
var defaultChatId = 'Set your telegram chat id';

function save_options() {
  localStorage['botToken'] = document.getElementById('bot_token').value;
  localStorage['chatId'] = document.getElementById('chat_id').value;  
  
  var url = 'https://api.telegram.org/bot' + document.getElementById('bot_token').value + '/sendMessage?chat_id=' + document.getElementById('chat_id').value + '&text=' + encodeURI('Bot connected.');
		
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		  var response = xmlhttp.responseText; //if you need to do something with the returned value
      }
  }
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
  
  var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
}

function restore_options() {
  var botToken = localStorage['botToken'];
  var chatId = localStorage['chatId'];
  
  if (botToken == undefined)
	botToken = defaultBotToken;
  
  if (chatId == undefined)
    chatId = defaultChatId;
  
  document.getElementById('bot_token').value = botToken;
  document.getElementById('chat_id').value = chatId;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
