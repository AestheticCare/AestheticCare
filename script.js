// Products with stock
let products = JSON.parse(localStorage.getItem("products")) || [
    {name:"Hydrafacial", price:120, stock:5},
    {name:"Vitamin C Serum", price:35, stock:10}
];

let codes = JSON.parse(localStorage.getItem("codes")) || {};
let cart = [];
let discount = 0;

// Render products
function renderProducts(){
    let html = "";
    products.forEach((p,i)=>{
        html += `
        <div class="card">
            <h3>${p.name}</h3>
            <p>Price: $${p.price} | Stock: ${p.stock}</p>
            <button onclick="addCart(${i})">Add to Cart</button>
        </div>`;
    });
    document.getElementById("products").innerHTML = html;
}

// Toggle cart panel
function toggleCart(){
    document.getElementById("cartPanel").classList.toggle("hidden");
    renderCart();
}

// Add product to cart
function addCart(index){
    let product = products[index];
    let item = cart.find(c=>c.name===product.name);
    if(item){
        if(item.quantity<product.stock){
            item.quantity++;
        } else {
            alert("Out of stock!");
            return;
        }
    } else {
        cart.push({name:product.name, price:product.price, quantity:1});
    }
    updateCartCount();
    renderCart();
}

// Render cart panel
function renderCart(){
    let cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML="";
    let total=0;
    cart.forEach((item,i)=>{
        let subtotal = item.price*item.quantity;
        total+=subtotal;
        cartItemsDiv.innerHTML+=`
            <div>
                <strong>${item.name}</strong> $${item.price} x ${item.quantity} = $${subtotal}
                <br>
                <button onclick="changeQty(${i},-1)">-</button>
                <button onclick="changeQty(${i},1)">+</button>
            </div>
            <hr>
        `;
    });
    total = total - (total*discount/100);
    document.getElementById("cartTotal").innerText = total;
}

// Change quantity
function changeQty(index,delta){
    let item = cart[index];
    let product = products.find(p=>p.name===item.name);
    if(delta>0 && item.quantity>=product.stock){
        alert("Out of stock!");
        return;
    }
    item.quantity+=delta;
    if(item.quantity<=0) cart.splice(index,1);
    updateCartCount();
    renderCart();
}

// Update cart count
function updateCartCount(){
    let count = cart.reduce((sum,i)=>sum+i.quantity,0);
    document.getElementById("cartCount").innerText = count;
}

// Add product (Admin)
function addProduct(){
    let name=document.getElementById("productName").value;
    let price=Number(document.getElementById("productPrice").value);
    let stock=Number(document.getElementById("productStock").value);
    products.push({name,price,stock});
    localStorage.setItem("products",JSON.stringify(products));
    renderProducts();
}

// Coupons
function addCode(){
    let code=document.getElementById("codeName").value.toUpperCase();
    codes[code]={
        discount:Number(document.getElementById("codeDiscount").value),
        expiry:document.getElementById("codeExpiry").value,
        limit:Number(document.getElementById("codeLimit").value),
        used:0
    };
    localStorage.setItem("codes",JSON.stringify(codes));
    alert("Coupon Added");
}

// Apply discount
function applyDiscount(){
    let code=document.getElementById("discountInput").value.toUpperCase();
    let msg=document.getElementById("discountMessage");
    if(!codes[code]){
        msg.innerText="Invalid Code"; return;
    }
    let c=codes[code];
    let today=new Date().toISOString().split("T")[0];
    if(today>c.expiry){ msg.innerText="Code Expired"; return; }
    if(c.used>=c.limit){ msg.innerText="Usage Limit Reached"; return; }
    discount=c.discount;
    c.used++;
    localStorage.setItem("codes",JSON.stringify(codes));
    msg.innerText=`${c.discount}% discount applied`;
    renderCart();
}

// Book appointment
function book(){
    let appointments=JSON.parse(localStorage.getItem("appointments"))||[];
    appointments.push({
        name:document.getElementById("name").value,
        email:document.getElementById("email").value,
        date:document.getElementById("date").value
    });
    localStorage.setItem("appointments",JSON.stringify(appointments));
    alert("Appointment booked");
}

// Admin login
function login(){
    let user=document.getElementById("adminUser").value;
    let pass=document.getElementById("adminPass").value;
    if(user==="admin" && pass==="1234"){
        document.getElementById("adminPanel").classList.remove("hidden");
    } else alert("Wrong login");
}

// PayPal integration
function pay(){
    let total=document.getElementById("cartTotal").innerText;
    if(total>0){
        total=Math.round(total);
        // Replace 'YourUsername' with your PayPal.me username
        let paypalLink=`https://www.paypal.com/paypalme/YourUsername/${total}`;
        window.location.href=paypalLink;
    } else alert("Cart is empty!");
}

renderProducts();
