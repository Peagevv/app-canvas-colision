const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Dimensiones del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#310a61";

// Cargar el sonido de colisión
const collisionSound = new Audio('cho.mp3');

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.baseColor = color; // Guarda el color base
        this.text = text;
        this.speed = speed;

        this.collisionCount = 0; // Contador de colisiones

        this.dx = Math.random() < 0.5 ? -this.speed : this.speed;
        this.dy = Math.random() < 0.5 ? -this.speed : this.speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color; // Relleno del círculo
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill(); // Rellena el círculo con su color
        context.strokeStyle = "black"; // Borde en negro para mejor visibilidad
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        // Mostrar texto con contador de colisiones
        context.fillStyle = "black"; // Color del texto
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(`${this.text} (${this.collisionCount})`, this.posX, this.posY);
    }

    update(context) {
        this.draw(context);

        // Rebote contra los bordes
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }
        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy;
        }

        // Movimiento
        this.posX += this.dx;
        this.posY += this.dy;
    }

    // Detecta colisión con otro círculo
    collidesWith(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    // Cambia de color cuando hay colisión
    changeColor() {
        const colors = ["red", "green", "yellow", "purple", "orange"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
}

// Crear múltiples círculos
const circles = [];
const N = 5; // Número de círculos

for (let i = 0; i < N; i++) {
    const randomX = Math.random() * (window_width - 50) + 25;
    const randomY = Math.random() * (window_height - 50) + 25;
    const randomRadius = Math.floor(Math.random() * 50 + 30);
    const randomSpeed = Math.random() * 2 + 1;

    circles.push(new Circle(randomX, randomY, randomRadius, "blue", `${i + 1}`, randomSpeed));
}

const updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);

    // Actualizar y dibujar círculos
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);

        // Detección de colisiones
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].collidesWith(circles[j])) {
                circles[i].changeColor();
                circles[j].changeColor();
                circles[i].collisionCount++;
                circles[j].collisionCount++;

                // Reproducir sonido de colisión sin solapamientos
                collisionSound.currentTime = 0;
                collisionSound.play();
            }
        }
    }
};

updateCircles();
