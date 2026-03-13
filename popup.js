var ODOO_URL = 'https://wild-orchard-beverages.odoo.com';
var ODOO_DB = 'wild-orchard-beverages';
var ODOO_USER = 'hello@drinkwildorchard.com';
var ODOO_PASS = '6ffcd05f9ee9ee8c3d57fead4de6b88adde499d6';
var MAILING_LIST_ID = 2;
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
  document.getElementById('popup-box').innerHTML = '<button onclick="closePopup()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:#999;">X</button><h2 style="margin:0 0 16px;font-size:24px;color:#dd2f58;">Thank you!</h2><p style="color:#666;margin:0 0 24px;">Here\'s your discount code</p><div style="background:#f9f9f9;border:2px dashed #dd2f58;border-radius:8px;padding:16px 24px;margin-bottom:24px;"><span style="font-size:22px;font-weight:bold;letter-spacing:3px;color:#dd2f58;">FIRSTORDER10</span></div><p style="color:#aaa;font-size:13px;margin:0;">Use this at checkout to get 10% off your first order.</p>';
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
    await fetch(ODOO_URL + '/web/session/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { db: ODOO_DB, login: ODOO_USER, password: ODOO_PASS } })
    });
    var createRes = await fetch(ODOO_URL + '/web/dataset/call_kw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model: 'mailing.contact', method: 'create', args: [{ name: email, email: email }], kwargs: {} } })
    });
    var createData = await createRes.json();
    var contactId = createData.result;
    await fetch(ODOO_URL + '/web/dataset/call_kw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model: 'mailing.contact', method: 'write', args: [[contactId], { subscription_list_ids: [[4, MAILING_LIST_ID]] }], kwargs: {} } })
    });
    showSuccess();
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
});
```

4. Scroll down and click **Commit new file**

---

## Step 4 — Get your file URL
Your file will be available at:
```
https://cdn.jsdelivr.net/gh/wogh773/wildorchard-scripts@main/popup.js
