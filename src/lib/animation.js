export function particleAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let nodeCount = 50;
    const maxDistance = 150;
    let animationSpeed = 1;
    let wormhole = null;
    let pentagons = [];
    let animationFrameId = null;

    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.pulseSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1);
        }

        update() {
            this.x += this.speedX * animationSpeed;
            this.y += this.speedY * animationSpeed;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            this.opacity += this.pulseSpeed;
            if (this.opacity > 1 || this.opacity < 0.5) this.pulseSpeed *= -1;

            // Dynamic speed change
            this.speedX += (Math.random() - 0.5) * 0.1;
            this.speedY += (Math.random() - 0.5) * 0.1;
            this.speedX = Math.max(-2, Math.min(2, this.speedX));
            this.speedY = Math.max(-2, Math.min(2, this.speedY));
        }

        draw() {
            ctx.fillStyle = `rgba(152, 255, 152, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Wormhole {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = 0;
            this.maxRadius = 100;
            this.growthRate = 0.5;
            this.rotationAngle = 0;
        }

        update() {
            this.radius += this.growthRate * animationSpeed;
            this.rotationAngle += 0.02 * animationSpeed;
            if (this.radius > this.maxRadius || this.radius < 0) {
                this.growthRate *= -1;
            }
            if (this.radius <= 0 && this.growthRate < 0) {
                wormhole = null;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotationAngle);

            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            gradient.addColorStop(0, 'rgba(152, 255, 152, 0.8)');
            gradient.addColorStop(1, 'rgba(152, 255, 152, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(152, 255, 152, 0.7)';
            ctx.lineWidth = 2;
            const sides = 6;
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const x = Math.cos(angle) * this.radius * 0.8;
                const y = Math.sin(angle) * this.radius * 0.8;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }
    }

    class Pentagon {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 30 + 20;
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
            this.glowIntensity = 0;
            this.glowDirection = 1;
        }

        update() {
            this.x += this.speedX * animationSpeed;
            this.y += this.speedY * animationSpeed;
            this.rotation += this.rotationSpeed * animationSpeed;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Glow effect
            this.glowIntensity += 0.05 * this.glowDirection;
            if (this.glowIntensity > 1 || this.glowIntensity < 0) {
                this.glowDirection *= -1;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Glow effect
            ctx.shadowBlur = 20 * this.glowIntensity;
            ctx.shadowColor = 'rgba(152, 255, 152, 0.5)';

            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(152, 255, 152, ${0.5 + this.glowIntensity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }
    }

    function createNodes() {
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    function createPentagons() {
        for (let i = 0; i < 5; i++) {
            pentagons.push(new Pentagon());
        }
    }

    function animateNodes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (wormhole) {
            wormhole.update();
            wormhole.draw();
        }

        for (let pentagon of pentagons) {
            pentagon.update();
            pentagon.draw();
        }

        for (let i = 0; i < nodes.length; i++) {
            if (wormhole) {
                const dx = nodes[i].x - wormhole.x;
                const dy = nodes[i].y - wormhole.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < wormhole.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (wormhole.radius - distance) / wormhole.radius;
                    nodes[i].x += Math.cos(angle) * force * 5 * animationSpeed;
                    nodes[i].y += Math.sin(angle) * force * 5 * animationSpeed;
                }
            }

            nodes[i].update();
            nodes[i].draw();

            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(152, 255, 152, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 1 * (1 - distance / maxDistance);
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        if (!wormhole && Math.random() < 0.002 * animationSpeed) {
            wormhole = new Wormhole();
        }

        // Randomly change animation speed
        animationSpeed += (Math.random() - 0.5) * 0.02;
        animationSpeed = Math.max(0.5, Math.min(1.5, animationSpeed));

        animationFrameId = requestAnimationFrame(animateNodes);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Initialize the animation
    resizeCanvas();
    createNodes();
    createPentagons();
    animateNodes();

    // Set up resize listener
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    // Return a cleanup function
    return {
        destroy() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            resizeObserver.disconnect();
        }
    };
}
