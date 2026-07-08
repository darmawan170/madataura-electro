<?php
// doku-create-payment.php - taruh di hosting
// PENTING: JANGAN upload file ini ke Github, karena ada Secret Key

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

$CLIENT_ID = 'BRN-0277-1783486887765'; // Client ID kamu
$SECRET_KEY = 'SK-YJ3zOEar2p82iy52ybgC'; // GANTI: Reveal di dashboard DOKU kamu

$SUPABASE_URL = 'https://brcqagdnuyjnowwjpdsi.supabase.co'; // GANTI: URL project Supabase kamu
$SUPABASE_KEY = 'sb_publishable_wtuP-CEENL85x7gjT4PQUQ__kAC3S5w'; // GANTI: anon key atau service_role key

$input = json_decode(file_get_contents('php://input'), true);
$amount = intval($input['amount'] ?? 0);
$invoice = $input['invoice'] ?? 'TRX'.time();
$email = $input['email'] ?? '';
$nama = $input['name'] ?? 'Customer';
$items = $input['items'] ?? [];
$ongkir = intval($input['ongkir'] ?? 0);
$layanan = $input['layanan'] ?? 'REG';
$alamat = $input['alamat'] ?? '';

if($amount < 1000){ echo json_encode(['error'=>'minimal 1000']); exit; }

$targetPath = "/checkout/v1/payment";
$timestamp = gmdate("Y-m-d\\TH:i:s\\Z");
$requestId = uniqid();
$body = [
  "order" => [
    "invoice_number" => $invoice,
    "amount" => $amount,
    "currency" => "IDR",
    "callback_url" => "https://darmawan170.github.io/madataura-electro/dokucalback.php", // GANTI domain kamu
    "auto_redirect" => true
  ],
  "payment" => [
    "payment_method_types" => ["DANA","OVO","GOPAY","SHOPEEPAY","LINKAJA","QRIS"],
    "payment_due_date" => 60
  ],
  "customer" => ["email"=>$email, "name"=>$nama]
];

$digest = base64_encode(hash('sha256', json_encode($body), true));
$component = "Client-Id:".$CLIENT_ID."\\nRequest-Id:".$requestId."\\nRequest-Timestamp:".$timestamp."\\nRequest-Target:".$targetPath."\\nDigest:".$digest;
$signature = base64_encode(hash_hmac('sha256', $component, $SECRET_KEY, true));

// Request ke DOKU
$ch = curl_init('https://api.doku.com/checkout/v1/payment');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "Client-Id: $CLIENT_ID",
  "Request-Id: $requestId",
  "Request-Timestamp: $timestamp",
  "Signature: HMACSHA256=$signature"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$resJson = json_decode($response, true);
curl_close($ch);

// Simpan pesanan ke Supabase status Menunggu Pembayaran
$supaBody = [
  "id" => $invoice,
  "user_email" => $email,
  "user_nama" => $nama,
  "items" => $items,
  "total" => $amount,
  "ongkir" => $ongkir,
  "layanan" => $layanan,
  "metode" => "E-Wallet",
  "status" => "Menunggu Pembayaran",
  "alamat" => $alamat,
  "doku_invoice" => $invoice,
  "doku_payment_url" => $resJson['response']['payment']['url'] ?? ''
];
$ch2 = curl_init($SUPABASE_URL.'/rest/v1/pesanan');
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($supaBody));
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
  "apikey: $SUPABASE_KEY",
  "Authorization: Bearer $SUPABASE_KEY",
  "Content-Type: application/json",
  "Prefer: return=minimal"
]);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch2);
curl_close($ch2);

echo $response;