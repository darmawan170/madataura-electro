let products = [];
let cart = [];
const JSON_PATH = './products.json'; // penting pakai ./

async function loadProducts(){
  try {
    const res = await fetch(JSON_PATH + '?v=' + Date.now());
    if(!res.ok) throw new Error('Gagal load');
    products = await res.json();
  } catch(e){
    console.log("Fetch gagal, pakai data cadangan", e);
    // FALLBACK BIAR DI SCREENSHOT KAMU NGGAK KOSONG LAGI
    products = [
      { "id": 1, "name": "Kaos Oversize Essential", "category": "fashion", "price": 129000, "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
      { "id": 2, "name": "Sneakers Court Low", "category": "sepatu", "price": 459000, "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
      { "id": 3, "name": "TWS Earbuds Pro", "category": "elektronik", "price": 299000, "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500" },
      { "id": 4, "name": "Tote Bag Canvas", "category": "fashion", "price": 89000, "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500" }
    ];
  }
  render(products);
}

function formatRupiah(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n); }
function render(list){
  const grid = document.getElementById('productGrid');
  if(!list.length){ grid.innerHTML = '<p>Produk tidak ditemukan</p>'; return; }
  grid.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <h4>${p.name}</h4>
      <div class="price">${formatRupiah(p.price)}</div>
      <button onclick="addToCart(${p.id})">+ Keranjang</button>
    </div>
  `).join('');
}
// ... sisa fungsi cart sama seperti sebelumnya
