const menu = document.querySelector('menu')

const toggleMenu = () => {
    menu.classList.toggle('open')
    toggleHamburguer()
}

const hamburguer = document.querySelector('.hamburguer')

const toggleHamburguer = () => {
    if(menu.classList.contains('open')){
        hamburguer.innerHTML = 'close'
    } else {
        hamburguer.innerHTML = 'menu'
    }
}
