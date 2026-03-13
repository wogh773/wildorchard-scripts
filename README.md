var PROXY_URL = 'https://wildorchard-proxy.vercel.app/api/subscribe';
var SHOW_ONCE = true;

function openPopup() {
  if (SHOW_ONCE && localStorage.getItem('popup_seen')) return;
  document.getElementById('popup-overlay').style.display = 'flex';
  document.getElementById('popup-box').style.display = 'block';
  if (SHOW_ONCE) localStorage.setItem('popup_seen', '1');
}

function closePopup() {
  document.getElementById('popup-overlay').style.display = 'none';
  document.getElementById('popup-box').style.display = 'none';
}

function showSuccess() {
  document.getElementById('popup-box').innerHTML = '<button onclick="closePopup()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:#999;">X</button><h2 style="margin:0 0 16px;font-size:24px;color:#dd2f58;">Thank you!</h2><p style="color:#666;margin:0 0 24px;">Here is your discount code</p><div style="background:#f9f9f9;border:2px dashed #dd2f58;border-radius:8px;padding:16px 24px;margin-bottom:24px;"><span style="font-size:22px;font-weight:bold;letter-spacing:3px;color:#dd2f58;">FIRSTORDER10</span></div><p style="color:#aaa;font-size:13px;margin:0;">Use this at checkout to get 10% off your first order.</p>';
}

async function submitPopup() {
  var email = document.getElementById('popup-email').value;
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email.');
    return;
  }
  var btn = document.getElementById('popup-submit-btn');
  btn.textContent = 'Subscribing...';
  btn.disabled = true;
  try {
    var res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    var data = await res.json();
    if (data.success) {
      showSuccess();
    } else {
      throw new Error('Failed');
    }
  } catch(e) {
    btn.textContent = 'Subscribe';
    btn.disabled = false;
    alert('Something went wrong. Please try again.');
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('popup-overlay').addEventListener('click', closePopup);
  setTimeout(openPopup, 2000);
