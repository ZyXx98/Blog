document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. Scroll-Animation (Intersection Observer)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));


    // ==========================================
    // 2. Lightbox-Funktion (Für Bilder)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        const images = document.querySelectorAll('.post-image img, .screenshot-grid img');
        images.forEach(image => {
            image.addEventListener('click', (e) => {
                lightboxImg.src = e.target.src;
                lightbox.classList.add('show');
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('show');
            }
        });
    }


    // ==========================================
    // 3. Interaktive Partikel
    // ==========================================

   // Variablen für die Mausposition und Geschwindigkeitsberechnung
    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;

    // Funktion, die ein einzelnes Partikel erzeugt (ausgelagert, um Code-Duplikate zu vermeiden)
    function spawnParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        
        // Symbol auswählen
        const symbols = ['⬤'];
        particle.textContent = symbols[0];
        
        // Zufällige Farbe
        const colors = [
            'var(--theme-primary, #8caed4)', 
            'var(--theme-secondary, #d48c8c)', 
            'var(--bg-tint, #333333)'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Zufällige Größe
        const size = Math.random() * 4 + 2;
        particle.style.fontSize = `${size}px`;
        particle.style.color = randomColor;
        particle.style.textShadow = `0 0 ${size * 0.8}px ${randomColor}`;
        
        // Position setzen
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // 360-Grad-Flugrichtung berechnen
        requestAnimationFrame(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80 + 30; // Erhöhte Distanz für organischen Funkenflug
            
            const randomX = Math.cos(angle) * distance;
            const randomY = Math.sin(angle) * distance;
            const randomRotation = Math.random() * 180 - 90;
            
            particle.style.transform = `translate(-50%, -50%) translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
            particle.style.opacity = '0';
        });
        
        // Partikel löschen (an deine 3.5s CSS-Transition angepasst)
        setTimeout(() => { particle.remove(); }, 3500);
    }

    // 1. Mausbewegung tracken UND zusätzliche Partikel bei hoher Geschwindigkeit spawnen
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (lastX !== -100 && lastY !== -100) {
            // Berechne die Distanz zur vorherigen Position (Satz des Pythagoras)
            const deltaX = mouseX - lastX;
            const deltaY = mouseY - lastY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Wenn die Bewegung schnell genug ist, spawne geschwindigkeitsabhängig Partikel
            // Je größer die Distanz (Mausgeschwindigkeit), desto eher/mehr Partikel entstehen
            if (distance > 10) { 
                // Erzeugt bei schnellen Bewegungen 1-2 zusätzliche Partikel direkt im Schweif
                const extraParticles = Math.floor(distance / 15);
                for (let i = 0; i < Math.min(extraParticles, 3); i++) {
                    // Leichtes "In-Between-Spawning", damit der Schweif keine Lücken hat
                    const interpolateX = lastX + (deltaX * (i / extraParticles));
                    const interpolateY = lastY + (deltaY * (i / extraParticles));
                    spawnParticle(interpolateX, interpolateY);
                }
            }
        }

        lastX = mouseX;
        lastY = mouseY;
    });

    // 2. Dauerhafter Basis-Timer für den Stillstand (alle 100ms ein Partikel)
    setInterval(() => {
        if (mouseX === -100 && mouseY === -100) return;
        
        // Im reinen Stillstand spawnen wir einfach gemütlich ein Partikel
        spawnParticle(mouseX, mouseY);
    }, 100);
});