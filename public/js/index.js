function group_click(obj) {
    if (!obj.parentElement.classList.contains('showen')) {
        obj.parentElement.classList.add('showen');
        obj.classList.add('show');
    }
    else {
        obj.parentElement.classList.remove('showen');
        obj.classList.remove('show');
    }
}

function ham_switch() {
    const menu = document.getElementsByClassName('aside__main');
    const button = document.getElementById('menu_but');
    if (menu.length !== 1 || button === undefined)
        return;
    if (button.checked)
        menu[0].style.display = 'block';
    else
        menu[0].style.removeProperty('display');

}

function notification() {
    const menu = document.getElementById('notification_menu');
    if (menu.style.display !== 'block')
        menu.style.display = 'block';
    else
        menu.style.removeProperty('display');
}