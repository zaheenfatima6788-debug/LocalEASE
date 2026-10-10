const providers = [
  {id:1,name:"Pintu Pulmbar",category:"Plumber",type:"PLUMBING / HOME REPAIR",rating:"4.7",reviews:"553",address:"SFS Manasarovar, Hans Vihar, Kalyanpura, Jaipur",phone:"+919928377528",glyph:"⌁",art:"plumbing",tag:"THE PIPE WHISPERER"},
  {id:2,name:"Electric Home Service",category:"Electrician",type:"ELECTRICAL / HOME SERVICE",rating:"4.9",reviews:"384",address:"C2 Plaza, Apex Circle, Malviya Nagar, Jaipur",phone:"+919829435147",glyph:"ϟ",art:"electric",tag:"THE SPARK FINDER"},
  {id:3,name:"Appliance Care India",category:"Appliance",type:"APPLIANCES / REPAIR",rating:"4.5",reviews:"981",address:"Swarn Path, Madhyam Marg, Mansarovar, Jaipur",phone:"+919024454230",glyph:"◉",art:"appliance",tag:"THE FIX-IT CREW"},
  {id:4,name:"Super Fast Plumbing Service",category:"Plumber",type:"PLUMBING / EMERGENCY",rating:"4.9",reviews:"397",address:"Prem Nagar Road, Gurjar Ki Thadi, Jaipur",phone:"+917742886022",glyph:"⌁",art:"plumbing",tag:"THE QUICK RESPONSE"},
  {id:5,name:"Gajendra Electrician Home Service",category:"Electrician",type:"ELECTRICAL / HOME SERVICE",rating:"5.0",reviews:"897",address:"Subhash Colony, Shastri Nagar, Jaipur",phone:"+918058986025",glyph:"ϟ",art:"electric",tag:"THE CIRCUIT SAVER"},
  {id:6,name:"Unitech Services",category:"Appliance",type:"HOME CARE / TECHNICAL",rating:"4.9",reviews:"613",address:"Choudhary Market, Khatipura, Vaishali Nagar, Jaipur",phone:"+919057361159",glyph:"✳",art:"general",tag:"THE HOME ALL-ROUNDER"}
];

const grid = document.getElementById("peopleGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
const modal = document.getElementById("bookingModal");
let activeProvider = null;
let toastTimer;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
function mapsUrl(address) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address + ", Jaipur, Rajasthan");
}
function renderProviders() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = providers.filter(person => {
    const searchable = [person.name, person.category, person.type, person.address, person.tag].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) && (category === "all" || person.category === category);
  });
  grid.innerHTML = filtered.map((person, index) => `
    <article class="person-card" style="animation-delay:${Math.min(index * 65, 300)}ms">
      <div class="person-art ${escapeHTML(person.art)}">
        <span class="art-index">LOCAL / ${String(person.id).padStart(2,"0")}</span>
        <span class="big-glyph" aria-hidden="true">${escapeHTML(person.glyph)}</span>
        <span class="art-kind">${escapeHTML(person.tag)}</span>
      </div>
      <span class="verified-mark">JAIPUR ↗</span>
      <div class="person-info">
        <span class="person-type">${escapeHTML(person.type)}</span>
        <h3 class="person-name">${escapeHTML(person.name)}</h3>
        <div class="person-meta"><span class="rating-star">★</span><strong>${escapeHTML(person.rating)}</strong><span>(${escapeHTML(person.reviews)} reviews in listing snapshot)</span></div>
        <p class="person-address">${escapeHTML(person.address)}</p>
        <div class="person-actions">
          <a href="${mapsUrl(person.address)}" target="_blank" rel="noopener noreferrer">Directions ↗</a>
          <button class="book-button" data-book="${person.id}">Request help <span>↗</span></button>
        </div>
      </div>
    </article>`).join("");
  resultsCount.textContent = `${String(filtered.length).padStart(2,"0")} PEOPLE`;
  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;
}
function applyQuery(query) {
  searchInput.value = query;
  categoryFilter.value = "all";
  renderProviders();
  document.getElementById("people").scrollIntoView({behavior:"smooth",block:"start"});
}
document.getElementById("searchButton").addEventListener("click", () => applyQuery(searchInput.value));
searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") applyQuery(searchInput.value);
});
searchInput.addEventListener("input", renderProviders);
categoryFilter.addEventListener("change", renderProviders);
document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => applyQuery(button.dataset.query)));
document.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => applyQuery(button.dataset.service)));
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-book]");
  if (!button) return;
  activeProvider = providers.find(person => person.id === Number(button.dataset.book));
  if (!activeProvider) return;
  document.getElementById("modalTitle").textContent = `Meet ${activeProvider.name}.`;
  document.getElementById("modalDescription").textContent = `Tell us what you need for ${activeProvider.category.toLowerCase()} support. This demo will prepare a request but won't contact the provider.`;
  document.getElementById("modalSymbol").textContent = activeProvider.glyph;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector("input[name='customerName']").focus();
});
function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }
document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) closeModal(); });
document.getElementById("bookingDate").min = new Date().toISOString().split("T")[0];
document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const request = {
    provider: activeProvider?.name ?? "LocalEASE provider",
    customer: String(data.get("customerName") || "").trim(),
    need: String(data.get("need") || "").trim(),
    date: String(data.get("date") || "")
  };
  if (!request.customer || !request.need) return;
  closeModal();
  event.currentTarget.reset();
  showToast(`Demo request prepared for ${request.provider}. No message was sent.`);
  console.info("LocalEASE demo booking request:", request);
});
document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  renderProviders();
});
document.getElementById("backToSearch").addEventListener("click", () => {
  window.scrollTo({top:0,behavior:"smooth"});
  setTimeout(() => searchInput.focus({preventScroll:true}), 450);
});
document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("services").scrollIntoView({behavior:"smooth"});
  showToast("Explore the services below ↘");
});

// Subtle cursor-responsive motion: disabled on touch and reduced-motion devices.
const art = document.getElementById("heroArt");
if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  art.addEventListener("pointermove", event => {
    const rect = art.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    art.querySelectorAll(".art-building,.float-pin,.sun-disc").forEach((element, index) => {
      const depth = (index % 3 + 1) * 5;
      element.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  art.addEventListener("pointerleave", () => {
    art.querySelectorAll(".art-building,.float-pin,.sun-disc").forEach(element => element.style.translate = "");
  });
}
renderProviders();
