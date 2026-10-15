(() => {
  const $ = (selector) => document.querySelector(selector);
  const form = $("#join-form");
  const panel = $("#success-panel");
  const qrTarget = $("#customer-qr");
  const phoneInput = $("#customer-phone");
  let currentQrText = "";

  $("#year").textContent = new Date().getFullYear();

  function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("show");
    window.setTimeout(() => element.classList.remove("show"), 2800);
  }

  function getMembers() {
    try { return JSON.parse(localStorage.getItem("wolkNightDemoMembers") || "[]"); }
    catch { return []; }
  }

  function saveMembers(members) {
    try {
      localStorage.setItem("wolkNightDemoMembers", JSON.stringify(members));
      return true;
    } catch {
      toast("Browser storage is unavailable. Please enable local storage.");
      return false;
    }
  }

  function makeMemberId() {
    const bytes = new Uint8Array(4);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return "WN-" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  phoneInput.addEventListener("input", () => {
    phoneInput.setCustomValidity("");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#customer-name").value.trim();
    const phone = phoneInput.value.trim().replace(/[\s()-]/g, "");
    if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
      phoneInput.setCustomValidity("Enter a valid mobile number with 10–15 digits.");
      phoneInput.reportValidity();
      return;
    }
    const members = getMembers();
    if (members.some(member => member.phone === phone)) {
      phoneInput.setCustomValidity("This mobile number is already registered in this browser demo.");
      phoneInput.reportValidity();
      return;
    }
    const member = { id: makeMemberId(), name, phone, createdAt: new Date().toISOString(), visits: 0, consent: $("#consent").checked };
    members.push(member);
    if (!saveMembers(members)) return;

    currentQrText = JSON.stringify({ brand: "WOLK-NIGHT-DEMO", memberId: member.id });
    qrTarget.innerHTML = "";
    if (typeof QRCode === "undefined") {
      qrTarget.textContent = "QR library could not load. Check your internet connection and refresh.";
    } else {
      new QRCode(qrTarget, { text: currentQrText, width: 150, height: 150, colorDark: "#201b13", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    }
    $("#customer-id").textContent = member.id;
    form.hidden = true;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#download-qr").addEventListener("click", () => {
    const image = qrTarget.querySelector("img");
    const canvas = qrTarget.querySelector("canvas");
    const dataUrl = image?.src || canvas?.toDataURL("image/png");
    if (!dataUrl) { toast("QR code is not ready yet."); return; }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "wolk-night-loyalty-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  $("#new-member").addEventListener("click", () => {
    panel.hidden = true;
    form.hidden = false;
    form.reset();
    qrTarget.innerHTML = "";
    currentQrText = "";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#staff-toggle").addEventListener("click", () => {
    const section = $("#staff-section");
    section.hidden = !section.hidden;
    $("#staff-toggle").setAttribute("aria-expanded", String(!section.hidden));
    if (!section.hidden) section.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#lookup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const id = $("#lookup-id").value.trim().toUpperCase();
    const member = getMembers().find(item => item.id === id);
    const result = $("#lookup-result");
    if (!member) {
      result.textContent = "No member found in this browser's demo registrations.";
      return;
    }
    result.textContent = `Demo member: ${member.name} · ID: ${member.id} · Visits: ${member.visits} · Registered: ${new Date(member.createdAt).toLocaleDateString()}. This lookup does not validate or issue coupons.`;
  });
})();