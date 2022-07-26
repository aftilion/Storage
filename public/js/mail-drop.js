function clickDrop(checkbox) {
  let mailDrop = document.getElementById('mail-drop');
  if (checkbox.checked) mailDrop.style.display = 'flex';
  else mailDrop.style.removeProperty('display');
}

function clickChoose(div) {
  let value = div.getAttribute('value');
  document.getElementsByName('checkbox')[0].checked = false;
  console.log();
  document.getElementsByName('mail')[0].children[0].value = value;

  let chosenMail = document.getElementById('mail-div');
  chosenMail
    .getElementsByClassName('mail-name')[0]
    .replaceWith(div.getElementsByClassName('mail-name')[0].cloneNode(true));
  chosenMail
    .getElementsByClassName('mail-mail')[0]
    .replaceWith(div.getElementsByClassName('mail-mail')[0].cloneNode(true));
  clickDrop(document.getElementsByName('checkbox')[0]);
}

function textareaResize(text) {
  let numberOfLineBreaks = (text.value.match(/\n/g) || []).length;
  // min-height + lines x line-height + padding + border
  let newHeight = 27 + numberOfLineBreaks * 27;
  text.style.height = newHeight + 'px';
}
