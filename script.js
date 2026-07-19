let products = []; let cart = [];
async function loadProducts(){
  const res = await fetch('products.json');
  products = await res.json();
  render(products);
}
function formatRupiah(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n); }
function render(list){
  document.getElementById('productGrid').innerHTML = list.map(p => `
    <div class="card"><img src="${p.image}"/><h4>${p.name}</h4><div>${formatRupiah(p.price)}</div><button onclick="addToCart(${p.id})">+ Keranjang</button></div>
  `).join('');
}
// ... fungsi cart search filter sama seperti di preview
loadProducts();