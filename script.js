const JSON_FILE = './products.json';
let products=[], cart=[];

async function loadProducts(){
  try{
    const r = await fetch(JSON_FILE+'?t='+Date.now());
    if(!r.ok) throw new Error();
    products = await r.json();
  }catch(e){
    // fallback jika github masih cache
    products = [{"id":1,"name":"Kaos Oversize Essential","category":"fashion","price":129000,"image":"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"}];
  }
  render(products);
}
function formatRupiah(n){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)}
function render(list){document.getElementById('productGrid').innerHTML=list.map(p=>`<div class="card"><img src="${p.image}"><h4>${p.name}</h4><div class="price">${formatRupiah(p.price)}</div><button onclick="addToCart(${p.id})">+ Keranjang</button></div>`).join('')}
function addToCart(id){const p=products.find(x=>x.id===id);const c=cart.find(x=>x.id===id);if(c)c.qty++;else cart.push({...p,qty:1});updateCart();openCart();}
function updateCart(){document.getElementById('cartCount').innerText=cart.reduce((a,b)=>a+b.qty,0);document.getElementById('cartCount2').innerText=cart.reduce((a,b)=>a+b.qty,0);document.getElementById('cartTotal').innerText=formatRupiah(cart.reduce((a,b)=>a+b.price*b.qty,0));document.getElementById('cartItems').innerHTML=cart.map(x=>`<div class="cart-item"><img src="${x.image}" style="width:40px;height:40px;border-radius:8px"><span>${x.name} x${x.qty}</span></div>`).join('')||'Kosong'}
function openCart(){document.getElementById('cartSidebar').classList.add('open');document.getElementById('overlay').classList.add('show')}
function closeCart(){document.getElementById('cartSidebar').classList.remove('open');document.getElementById('overlay').classList.remove('show')}
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;document.getElementById('overlay').onclick=closeCart;
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');const cat=b.dataset.cat;render(cat==='all'?products:products.filter(p=>p.category===cat))});
document.getElementById('searchInput').oninput=e=>{render(products.filter(p=>p.name.toLowerCase().includes(e.target.value.toLowerCase())))};
loadProducts();
