const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')


let cart = []


// abrir modal 
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex'
})

// fechar o modal ao clicar fora

cartModal.addEventListener('click', (event) => {
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (e) => {
    let parentButton = e.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
   
    if(existingItem){
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }




    updateCartModal()

}

function updateCartModal(){
    cartItemsContainer.innerText = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between"> 
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>(Quantidade: ${item.quantity})</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>   
            </div>
        `

        total += item.price * item.quantity


        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: 'currency',
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

cartItemsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("remove-from-cart-btn")){
        const name = e.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]
        
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener('input', event => {
    let inputValue = event.target.value

    if(inputValue){
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", () => {

    const isOpen = checkRestaurantOpen()

    if(!isOpen){
        Toastify({
            text: "Ops! Restaurante fechado.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }
        }).showToast();

        return
    }

    if(cart.length === 0) return;

    if(!addressInput.value) {
        addressWarn.classList.remove("hidden")
    }


    const cartItems = cart.map(item => {
        return (
            ` Produto: ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} | `
            )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "67996123728"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
    
})

function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora <= 22

}

const spanItem = document.getElementById("date-span")
const statusResturant = document.getElementById("status-restaurant")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
    statusResturant.innerHTML = 'Aberto'

} else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
    statusResturant.innerHTML = 'Fechado'
}