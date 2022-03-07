//Variables
const carrito = document.querySelector('#carrito');
const listapastels = document.querySelector('#lista-pasteles');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
const btnPagarCarrito = document.querySelector('#pagar-carrito')||document.querySelector('#pagar');
const btnPagar = document.querySelector('#pagar');
let articulosCarrito = [];


cargarEventListener();
function cargarEventListener(){
    //Eventos
    // En cuanto carga
    document.addEventListener('DOMContentLoaded',() => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })
    //Agregar al carrito
    listapastels.addEventListener('click', agregarpastel);
    //Eliminar pastel
    carrito.addEventListener('click', eliminarpastel);
    //vaciamos el carrito
    btnVaciarCarrito.addEventListener('click', () => {
        limpiarCarrito(); //Quitamos el HTML
        articulosCarrito = []; // Reiniciamos el arreglo
        sincronizarStorage(); //Volvemos a actualizar el storage
    })
    //vaciamos el carrito
    btnPagarCarrito.addEventListener('click', () => {
        // limpiarCarrito(); //Quitamos el HTML
        // articulosCarrito = []; // Reiniciamos el arreglo
         sincronizarStorage(); //Volvemos a actualizar el storage
    })
    //Boton pagar
    btnPagar.addEventListener('click', eliminarpastel);

}


//Funciones
function agregarpastel(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
        const pastelSeleccionado = e.target.parentElement.parentElement;
        obtenDatospastel(pastelSeleccionado);
        alert(`Se agrego correctamente el pastel ${pastelSeleccionado.querySelector('h4').textContent}`);
    }
}

function obtenDatospastel(pastel){
    //pastel
    const infopastel = {
        imagen: pastel.querySelector('img').src,
        titulo: pastel.querySelector('h4').textContent,
        precio: pastel.querySelector('.precio span').textContent,
        id: pastel.querySelector('a').getAttribute('data-id'),
        cantidad: 1
        }
    //Revisamos si ya existe
    const existe = articulosCarrito.some( pastel => pastel.id === infopastel.id);
    if(existe){
        //Actualizamos la cantidad
        const articulos = articulosCarrito.map( pastel => {
            if ( pastel.id === infopastel.id ) {
                pastel.cantidad += 1;
                return pastel;
            } else {
                return pastel;
            }
        })
    }else{
        //Agregamos al arreglo de articulos
        articulosCarrito = [...articulosCarrito, infopastel];
    }
    carritoHTML();
}

//Mostrar carrito
function carritoHTML() {
    //Limpiamos el html
    limpiarCarrito();

    //Recorremos el carrito y generamos el html
    if(articulosCarrito.length>0){
        articulosCarrito.forEach(pastel => {
            const {imagen, titulo, precio, cantidad, id} = pastel;
            const row = document.createElement('tr');
            row.innerHTML=`
            <td>
                <img src="${imagen}" width="120">
            </td>    
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-pastel" data-id="${id}"> X </a>
            </td>
            `;
            
            // Agregamos al tbody
            contenedorCarrito.appendChild(row);
        });
    }
    //Sincronizamos con storage
    sincronizarStorage();
}
//Lo guardamos en storage
function sincronizarStorage() {
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
}
//Limpiamos carrito
function limpiarCarrito() {
    /*
    contenedorCarrito.innerHTML = '';
    */

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

//eliminamos pastel del carrito
function eliminarpastel(e) {
    if(e.target.classList.contains('borrar-pastel')){
        const pastelId = e.target.getAttribute('data-id');
        // lo eliminamos
        articulosCarrito = articulosCarrito.filter(pastel => pastel.id !== pastelId);
        
        //Actualizamos el carrito
        carritoHTML();
    }
    
}
