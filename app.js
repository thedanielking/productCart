const fetchData = (index, isConfirmed)=>{
    const fetchPromise = fetch("./data.json");
    fetchPromise.then((response)=>{
        if(!response.ok){
            throw new Error (`HTTP error: ${response.status}`)
        }
        return response.json();
    })
    .then((data)=>{
        if(isConfirmed){
            createConfirmedElements(data);
        }else{
            createCartElement(data, index);
        }
        
    
    })
    .catch((error) =>{
        console.log(`Could not get product: ${error}`);
    });

}



// declarations
const foods = document.querySelector("#foods").children;
const picture = document.querySelectorAll("#foods div picture img");
const addToCartBtn = document.querySelectorAll("#addToCartBtn");
let orderQuantity = document.querySelectorAll("#orderQuantity")
const plusIcon = document.querySelectorAll(".plusIcon")
const minusIcon = document.querySelectorAll(".minusIcon")
let quantity = document.querySelectorAll("#quantity");
let cartCount = document.querySelector("#cartCount");
let orderPrice = document.querySelectorAll("#orderPrice")
const orderConfirmedContainer = document.querySelector("#orderConfirmContainer");
const totalprice = document.querySelector("#totalPrice");
const confirmedElementsContainer = document.querySelector("#confirmedElementsContainer");
// const finalOrderContainer = document.querySelector("#finalOrderContainer");




numCart = 0;
addToCartBtn.forEach((btn, index) =>{
    btn.addEventListener("click", ()=>{
    orderQuantity[index].classList.remove("hidden");
    picture[index].classList.add("border-4");
    picture[index].classList.add("border-(--clr--red)");
    addToCart(index);
    plusIcon[index].addEventListener("click", ()=>{
        let count = Number(quantity[index].textContent)
        let numberOfOrder = document.querySelectorAll("#numberOfOrder");
        count++;

        let orderSum = document.querySelectorAll("#orderSum");

        
        quantity[index].textContent = count;
        if(numberOfOrder.length == 1){
            numberOfOrder[0].textContent = count;
            let sum =  count * parseFloat(orderPrice[0].textContent.slice(1))
            orderSum[0].textContent = sum.toFixed(2);
            getTotalCartCount()
            getTotalPrice();
        }
        else{
            numberOfOrder[index].textContent = count;
            let sum =  count * parseFloat(orderPrice[index].textContent.slice(1))
            orderSum[index].textContent = sum.toFixed(2);
            getTotalCartCount()
            getTotalPrice();
        }

        
    })

    minusIcon[index].addEventListener("click", ()=>{
        let count = Number(quantity[index].textContent)
        let numberOfOrder = document.querySelectorAll("#numberOfOrder");
        let orderSum = document.querySelectorAll("#orderSum");
        count--;

        if(count < 2){
            count = 1
            quantity[index].textContent = count;
        }

        
        quantity[index].textContent = count;
        if(numberOfOrder.length == 1){
            numberOfOrder[0].textContent = count;
            let sum =  count * parseFloat(orderPrice[0].textContent.slice(1))
            orderSum[0].textContent = sum.toFixed(2);
            getTotalCartCount();
            getTotalPrice();
        }
        else{
            numberOfOrder[index].textContent = count;
            let sum =  count * parseFloat(orderPrice[index].textContent.slice(1))
            orderSum[index].textContent = sum.toFixed(2);
            getTotalCartCount();
            getTotalPrice();
        }
    })

    
    
    })
})


// cart functionality


const cartContainer = document.querySelector("#cartContainer");
const emptyCartContainer = document.querySelector("#emptyCart");
const confirmOrder = document.querySelector("#confirmOrder")
let isConfirmed = false;

const addToCart = (index)=>{
    emptyCartContainer.classList.add("hidden");
    confirmOrder.classList.remove("hidden");
    // let isConfirmed = false;
    fetchData(index, isConfirmed);
}

const createCartElement = (data, index)=>{
    const cartElement = document.createElement("div");
        cartElement.className = "cartEl";
        cartElement.innerHTML =
        `<div class="flex items-center justify-between border-b border-b-gray-200 pb-6">
        <div class="space-y-3">
          <h3 class="font-medium text-lg lg:text-2xl">${data[index].name}</h3>
          <div class="flex gap-4 text-2xl">
            <p class="text-(--clr--red) font-medium "><span id ="numberOfOrder">1</span>x</p>
            <p class="text-gray-500">@${data[index].price} <span class="text-gray-700 font-medium" id="orderSum">${data[index].price}</span></p>
          </div>
        </div>
        <div class="border-2 border-gray-400 p-1 lg:p-2 rounded-full" onClick ="deleteFunction(${index})">
          <img src="/assets/images/icon-remove-item.svg" alt="delete" class="w-3 lg:w-5">
        </div>
      </div>`

      cartContainer.append(cartElement)
      getTotalPrice();

}


const deleteFunction = (index)=>{
    let deleteBtn = event.currentTarget;
    let item = deleteBtn.parentElement;
    cartContainer.removeChild(item.parentElement);

    quantity[index].textContent = 0;
    orderQuantity[index].classList.add("hidden");
    getTotalCartCount();
    checkCartContainerEmpty();
}

const checkCartContainerEmpty = ()=>{
    let container = document.querySelectorAll(".cartEl");
    if(container.length == 0){
        emptyCartContainer.classList.remove("hidden");
        confirmOrder.classList.add("hidden");
    }
    
}

const getTotalCartCount = ()=>{
    let numberOfOrder = document.querySelectorAll("#numberOfOrder");
    let sum = 0;
    numberOfOrder.forEach(item=>{
        sum += Number(item.textContent);
    })

    cartCount.textContent = sum

    
}


const getTotalPrice = ()=>{
    let orderSumContainer = document.querySelectorAll("#orderSum")
    let totalSum = 0;
    orderSumContainer.forEach(item=>{
        totalSum += Number(item.textContent);
    })
    totalprice.textContent = `$${totalSum.toFixed(2)}`;
}

const confirmOrderBtn = ()=>{
    orderConfirmedContainer.classList.remove("hidden");
    isConfirmed = true;
    fetchData(0, isConfirmed);
}

const createConfirmedElements = (data)=>{
    const containerElements = document.querySelectorAll(".cartEl");

    for(let i = 0; i < foods.length; i++){
        containerElements.forEach((element)=>{
            let elementName = element.querySelector("div div h3").textContent;
            let elementOrderNumber = element.querySelector("div div div #numberOfOrder").textContent;
            let elementOrderPrice = element.querySelector("div div div #orderSum").textContent;


            if(foods[i].querySelector("div div h2").textContent == elementName){
                const confirmedElements = document.createElement("div");

                confirmedElements.setAttribute("class", "flex items-center justify-between border-b border-b-gray-300 py-3")

                confirmedElements.innerHTML = 
                `
                <div class="flex gap-2">
                <img src="${data[i].image['thumbnail']}" alt="${data[i].name}" class="w-10 h-10">
                <div>
                    <h3 class="font-medium">${data[i].name}</h3>
                    <p class="text-gray-400 text-sm"><span class="text-(--clr--red) font-medium">${elementOrderNumber}x</span> @${data[i].price}</p>
                </div>
                </div>
                <p>${elementOrderPrice}</p>
                `

                confirmedElementsContainer.appendChild(confirmedElements)

            }

        })
        
    }
        const finalOrderContainer = document.createElement("div");
                finalOrderContainer.setAttribute("class", "flex justify-between");
                finalOrderContainer.innerHTML = 
                `
                    <p>Order Total</p>
                    <p class="font-bold text-xl">${totalprice.textContent}</p>
                `
                confirmedElementsContainer.appendChild(finalOrderContainer);
}

const clearCart = ()=>{
    orderConfirmedContainer.classList.add("hidden");
    let container = document.querySelectorAll(".cartEl");
    container.forEach(item =>{
        item.remove()
    })
    orderQuantity.forEach((item, index) =>{
        item.classList.add("hidden")
        item.querySelector("#quantity").textContent = 1;
        picture[index].classList.remove("border-4");
        picture[index].classList.remove("border-(--clr--red)");
    })
    checkCartContainerEmpty();
    cartCount.textContent = 0;
    confirmedElementsContainer.innerHTML = ' ';
    isConfirmed = false;
} 











        


