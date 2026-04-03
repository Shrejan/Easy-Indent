const DEBUG = true;
function log(...args) { if (DEBUG) console.log("[auto-select2]", ...args); }

function waitFor(selector, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(iv);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(iv);
        reject(new Error("timeout"));
      }
    }, 250);
  });
}

function dispatchMouseEvents(el) {
  const rect = el.getBoundingClientRect();  
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  ["mousedown", "mouseup", "click"].forEach(type => {
    const ev = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0
    });
    el.dispatchEvent(ev);
  });
}

async function clickVisibleOption(optionText) {
  const listSelector = ".select2-results__option";
  await new Promise(r => setTimeout(r, 200));
  const opts = Array.from(document.querySelectorAll(listSelector));
  for (const o of opts) {
    if (o.textContent && o.textContent.trim() === optionText) {
      dispatchMouseEvents(o);
      o.click();
      log("✅ Option clicked:", optionText);
      return true;
    }
  }
  return false;
}

function findClickableForDropdown(dropdownSelector) {
  const container = document.querySelector(dropdownSelector);
  if (!container) return null;
  if (getComputedStyle(container).pointerEvents !== "none") return container;
  const arrow = container.parentElement && container.parentElement.querySelector(".select2-selection__arrow");
  if (arrow) return arrow;
  const sel = container.closest(".select2-selection, .select2-selection--single");
  if (sel) return sel;
  return container;
}

async function autoSelect(dropdownSelector, optionText, maxAttempts = 12, intervalMs = 1000) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt++;
    log(`Attempt ${attempt}/${maxAttempts}`);

    const clickable = findClickableForDropdown(dropdownSelector);
    if (clickable) {
      try {
        dispatchMouseEvents(clickable);
        clickable.click();
      } catch (err) {
        log("Error clicking clickable:", err);
      }
    } else {
      log("No clickable target found for selector yet:", dropdownSelector);
    }

    await new Promise(r => setTimeout(r, 250));

    try {
      const ok = await clickVisibleOption(optionText);
      if (ok) {
        log("🎯 Selection successful");
        return true;
      }
    } catch (e) {
      log("Error clicking visible option:", e);
    }

    await new Promise(r => setTimeout(r, intervalMs));
  }

  log("❌ Failed to select after attempts");
  return false;
}

async function setQuantityAndSubmit() {
  try {
    // wait for quantity field to appear
    const quantityInput = await waitFor("#indentCbsId0", 10000);
    if (quantityInput) {
      // If field is readonly, allow script update and trigger change callbacks.
      if (quantityInput.readOnly) {
        quantityInput.readOnly = false;
      }

      quantityInput.value = "22";
      quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
      quantityInput.dispatchEvent(new Event("change", { bubbles: true }));

      // call inline handlers directly if present to ensure calculations run as expected.
      if (typeof validateRetIndentItemData === "function") {
        try {
          validateRetIndentItemData('0', 'CBS');
        } catch (e) {
          log('⚠️ validateRetIndentItemData failed', e);
        }
      }
      if (typeof calculateIndentAmount === "function") {
        try {
          calculateIndentAmount('CBS','0','indentCbsClass','indentCbsId0');
        } catch (e) {
          log('⚠️ calculateIndentAmount failed', e);
        }
      }

      log("🧮 Quantity set to 22");

      // Optional delay before submitting
      await new Promise(r => setTimeout(r, 500));

      // Try pressing Enter key
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",
        keyCode: 13
      });
      quantityInput.dispatchEvent(enterEvent);

      // OR click submit button if available
      const submitBtn = document.querySelector("#saveBtnId");
      if (submitBtn) {
        dispatchMouseEvents(submitBtn);
        submitBtn.click();
        log("🚀 Submitted successfully");
      } else {
        log("⚠️ Submit button not found — used Enter instead");
      }
    }
  } catch (e) {
    log("Error setting quantity or submitting:", e);
  }
}

function getSavedIndentSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['product', 'quantity'], (items) => {
      resolve({
        product: items.product || 'DK Double Kick Fine Whisky-Aseptic Brick Pack 180MLx48ABP(0022)',
        quantity: items.quantity || '22'
      });
    });
  });
}

async function startAutomation() {
  const { product, quantity } = await getSavedIndentSettings();
  const dropdownSelector = '#select2-iteamNameId0-container';

  autoSelect(dropdownSelector, product, 30, 800)
    .then(ok => {
      if (ok) {
        log('✅ Auto selection succeeded');
        setQuantityAndSubmit(quantity || '22');
      } else {
        log('❌ Auto selection failed');
      }
    });
}

window.addEventListener('load', startAutomation);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === 'runIndentAutomation') {
    startAutomation().then(() => {
      sendResponse({ done: true });
    }).catch(err => {
      log('❌ automation error', err);
      sendResponse({ done: false, error: err?.message || 'unknown' });
    });
    return true;
  }
});


//"https://ksbclonline.karnataka.gov.in/KSBCL/retailerView/RetailerIndent"
//DK Double Kick Fine Whisky-Aseptic Brick Pack 90MLx96ABP(0022)
// Mysore Lancer Deluxe Quality Whisky-Aseptic Brick Pack 90MLx96Btls(0021)
//DK Double Kick Fine Whisky-Aseptic Brick Pack 180MLx48ABP(0022)
