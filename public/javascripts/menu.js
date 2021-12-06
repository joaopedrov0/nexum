const menu = document.querySelector('menu')

const toggleMenu = () => {
    menu.classList.toggle('open')
    toggleHamburguer()
}

const hamburguer = document.querySelector('.hamburguer')

const toggleHamburguer = () => {
    hamburguer.classList.toggle('close')
}
