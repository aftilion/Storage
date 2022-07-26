function removeLink(obj) {
  fetch(obj, {
    method: 'DELETE',
  }).then(() => {
    location.reload();
  });
}

async function froze(obj, link) {
  await fetch(link + '?isFrozen=' + obj.checked, {
    method: 'PUT',
  });
}
async function changeName(obj, link) {
  await fetch(link + '?name=' + obj.value, {
    method: 'PUT',
  });
}
