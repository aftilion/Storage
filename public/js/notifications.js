let socket = io('wss://goodbroch.ru');

socket.onerror = function (error) {
  console.log('socket error', error);
};

socket.emit('setUser');

socket.emit('getAllNotifications', (notifications) => {
  const menu = document.getElementById('notification_menu');
  menu.innerHTML = '';
  if (notifications.length === 0)
    notifications.push({
      name: 'Здесь ничего нет',
      description: '',
      status: 0,
    });

  notifications.forEach((element) => {
    let div = document.createElement('div');
    div.classList.add('notification_element');
    div.innerHTML = element.name;
    switch (element.status) {
      case 1:
        div.classList.add('notification_successful');
        break;
      case 2:
        div.classList.add('notification_error');
        break;
    }

    div.appendChild(document.createElement('br'));
    let description = document.createElement('span');
    description.classList.add('notification_description');
    description.innerHTML = element.description;
    div.appendChild(description);
    menu.appendChild(div);
  });
});

socket.on(42, (data) => {
  console.log('123');
});

socket.on('getNotification', (data) => {
  const menu = document.getElementById('notification_menu');
  let div = document.createElement('div');
  div.classList.add('notification_element');
  div.innerHTML = data.name;
  switch (data.status) {
    case 1:
      div.classList.add('notification_successful');
      break;
    case 2:
      div.classList.add('notification_error');
      break;
  }

  div.appendChild(document.createElement('br'));
  let description = document.createElement('span');
  description.classList.add('notification_description');
  description.innerHTML = data.description;
  div.appendChild(description);
  menu.appendChild(div);
});

function notificationOnClick() {
  fetch('/mail/check').then((data) => {
    console.log('ok', data);
  });
}
