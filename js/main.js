// Elementos obtenidos del html usando DOM //

const cards= document.querySelector('#cards')
const card= document.querySelector('#card').content
const items= document.querySelector('#items')
const footer= document.querySelector('#footer')
const templateFooter= document.querySelector('#template-footer').content
const carritoCompras= document.querySelector('#carrito-compras').content
const toTop= document.querySelector('#toTop')
const btnGal1= document.querySelector('.box1')
const btnGal2= document.querySelector('.box2')
const btnGal3= document.querySelector('.box3')
const btnGal4= document.querySelector('.box4')
const btnGal5= document.querySelector('.box5')
const btnLeerMas= document.querySelector('.btn_leerMas')

toTop.addEventListener('click', ()=>{
    window.scrollTo(0,0)
})

btnLeerMas.addEventListener('click', ()=>{
    Toastify({
    text: "Botón en mantenimiento 😆",
    className: "info",
    position:'left',
    style: {
      background: "linear-gradient(to left, #000000ab,#9b00ab)",
    }
  }).showToast();
}) 



btnGal1.addEventListener('click', ()=>{
    Swal.fire({
        imageUrl:'css/img/gal4.jpg',
        showConfirmButton: false,
        imageHeight:'auto',
        background:'rgba(0, 0, 0, 0.005)',
        backdrop:`rgba(0,0,0,0.800)`
      })
})
btnGal2.addEventListener('click', ()=>{
    Swal.fire({
        imageUrl:'css/img/gal1.jpg',
        showConfirmButton: false,
        imageHeight:'auto',
        background:'rgba(0, 0, 0, 0.005)',
        backdrop:`rgba(0,0,0,0.800)`
      })
})
btnGal3.addEventListener('click', ()=>{
    Swal.fire({
        imageUrl:'css/img/gal3.jpg',
        showConfirmButton: false,
        imageHeight:'auto',
        background:'rgba(0, 0, 0, 0.005)',
        backdrop:`rgba(0,0,0,0.800)`
      })
})
btnGal4.addEventListener('click', ()=>{
    Swal.fire({
        imageUrl:'css/img/gal2.jpg',
        showConfirmButton: false,
        imageHeight:'auto',
        background:'rgba(0, 0, 0, 0.005)',
        backdrop:`rgba(0,0,0,0.800)`
      })
})
btnGal5.addEventListener('click', ()=>{
    Swal.fire({
        imageUrl:'css/img/gal5.jpg',
        showConfirmButton: false,
        imageHeight:'auto',
        background:'rgba(0, 0, 0, 0.005)',
        backdrop:`rgba(0,0,0,0.800)`
      })
})



const fragment= document.createDocumentFragment()
let carrito= {}

window.onload= function(){
    fetchData();
    if (localStorage.getItem('carrito')){
        carrito= JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
}
cards.addEventListener('click', e=>{
    addCarrito(e)
    Toastify({
        text: "Producto agregado al carrito",
        position:'left',
        style: {
          background: "linear-gradient(to left, #9b00e2, #000000ab)",
          fontFamily:"Kalam, cursive",
        }
      }).showToast();
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

//Fetch de mi JSON local//

const fetchData= async () =>{
    try {
        const respuesta= await fetch("/js/productos.json")
        const data= await respuesta.json();
        pintarCards(data)
    }
    catch (error) {
        console.log(error)
    }
}

// Funcion para mostrar las cartas en la página //

const pintarCards = (data) =>{
    data.forEach((producto) => {
        card.querySelector('h5').textContent= producto.nombre
        card.querySelector('span').textContent= producto.precio
        card.querySelector('img').setAttribute("src", producto.img)
        card.querySelector('button').style.backgroundColor = "#962ef8";
        card.querySelector('.btn').dataset.id=producto.id
        

        const clone=card.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Funcionalidad del carrito de compras //

const addCarrito=e=>{
    if(e.target.classList.contains('nav_l')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito= objeto=>{
    let=producto={
        id:objeto.querySelector('.nav_l').dataset.id,
        nombre:objeto.querySelector('h5').textContent,
        precio:objeto.querySelector('span').textContent,
        cantidad:1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad=carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito();
}

const pintarCarrito= ()=>{
    items.innerHTML=''
    Object.values(carrito).forEach(producto => {
        carritoCompras.querySelector('th').textContent = producto.id
        carritoCompras.querySelectorAll('td')[0].textContent = producto.nombre
        carritoCompras.querySelectorAll('td')[1].textContent = producto.cantidad
        carritoCompras.querySelector('.btn-info').dataset.id=producto.id
        carritoCompras.querySelector('.btn-danger').dataset.id=producto.id
        carritoCompras.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone=carritoCompras.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () =>{
    footer.innerHTML=''
    if(Object.keys(carrito).length===0){
        footer.innerHTML=`
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
   
    const nCantidad= Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)
    const nPrecio= Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[0].textContent=nCantidad
    templateFooter.querySelector('span').textContent=nPrecio

    const clone= templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar= document.querySelector('#vaciar-carrito')
    btnVaciar.addEventListener('click', ()=>{
        carrito={}
        pintarCarrito()
        Toastify({
            text: "El carrito ha sido vaciado exitosamente",
            duration:5000,
            position:'left',
            style: {
              fontFamily:"Kalam, cursive",
              background: "linear-gradient(to left, #000000ab,#9b00ab)",
            }
          }).showToast();
    })
}

const btnAccion = e =>{
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

// ------------------------------------ //