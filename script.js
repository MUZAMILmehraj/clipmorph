const BACKEND = "https://clipmorph-backend.onrender.com";

function openCategory(type) {
    const clipsDiv = document.getElementById("clips");
    document.getElementById("home").style.display = "none";
    document.getElementById("category").style.display = "block";
    document.getElementById("title").innerText = type.toUpperCase() + " CLIPS";
    
    clipsDiv.innerHTML = "<p>Loading clips...</p>";

    fetch(`${BACKEND}/clips/${type}`)
        .then(res => res.json())
        .then(data => {
            clipsDiv.innerHTML = "";
            if (!data.clips || data.clips.length === 0) {
                clipsDiv.innerHTML = "<p>No .mp4 files found in this folder.</p>";
                return;
            }

            data.clips.forEach(clip => {
                const card = document.createElement("div");
                card.className = "clip-card";
                card.innerHTML = `
                    <div class="video-preview">
                        <video width="100%" muted onmouseover="this.play()" onmouseout="this.pause()">
                            <source src="${clip.url}" type="video/mp4">
                        </video>
                    </div>
                    <p><strong>${clip.name}</strong></p>
                    <p>Price: ₹${clip.price}</p>
                    <button class="buy-btn" onclick="payNow(${clip.price}, '${clip.name}')">Buy Now</button>
                `;
                clipsDiv.appendChild(card);
            });
        })
        .catch(err => {
            console.error(err);
            clipsDiv.innerHTML = "⚠️ Backend not connected. Wait 30 seconds for Render to wake up.";
        });
}