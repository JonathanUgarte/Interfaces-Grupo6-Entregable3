class Board {
    constructor(matriz, posX, posY, width, height, fill, context, modoDeJuego, image) {
        this.posX = posX;
        this.posY = posY;
        this.fill = fill;
        this.context = context;
        this.width = width;
        this.height = height;
        this.matriz = matriz;
        this.modoDeJuego = modoDeJuego;
        this.image = image;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    draw() {
        // Dibuja el tablero de 4 en línea
        for (let i = 0; i < this.matriz.length; i++) {
            for (let j = 0; j < this.matriz[i].length; j++) {
                if (!this.matriz[i][j]) {
                    // Inicializa el slot si no existe
                    this.matriz[i][j] = new Slot(boardx0 + 50 * j, boardy0 + 50 * i, 50, 50, "blue", ctx, this.image);
                    slots.push(this.matriz[i][j]);
                }
                this.matriz[i][j].draw(); // Redibuja el slot
            }
        }
    
        // Dibuja la nueva primera fila de slots
        for (let i = 0; i < this.modoDeJuego + 3; i++) {
            const slot = new Slot(boardx0 + 50 * i, boardy0 - 50, 50, 50, "#237C75", ctx, this.image);
            posicionPonerFichas.push(slot);
    
            // Configura un color alternante para el borde en tonos personalizados
            let bordeParpadeoColor = "#237C75";
            setInterval(() => {
                bordeParpadeoColor = (bordeParpadeoColor === "#237C75") ? "#2A9D8F" : "#237C75";
                slot.fill = bordeParpadeoColor; // Cambia el color del borde del Slot
                slot.draw(); // Redibuja el Slot con el nuevo color del borde
            }, 500); // Cambia de color cada 500 ms para un efecto de parpadeo
    
            slot.draw(); // Dibuja inicialmente el slot
        }
    }
    
    redraw(){
        for (let i = 0; i < this.matriz.length; i++) {
            for (let j = 0; j < this.matriz[i].length; j++) {
                this.matriz[i][j].draw();
            }
        }
        for (let i = 0; i < this.modoDeJuego+3; i++) {
            posicionPonerFichas[i].draw();
        }
    }

    agregarFicha(columna, player) {
        if ((columna < this.modoDeJuego+3) && (player == 1 || player == 2)) {
            const ficha = new Ficha(this.posX+30+60*columna,this.posY+30+60*5,20,"",this.context, player, this.image);
            if (this.matriz[0][columna].getFicha().getPlayer() == 0) {
                let fila = this.buscarFilaLibre(columna);
                this.matriz[fila][columna].setFicha(ficha);
                return {
                    insertada: true,
                    fila: fila
                };
            }
            else return {
                insertada: false,
                fila: -1
            };
        }
    }

    buscarFilaLibre(columna) {
        let ultimaFilaLibre = 0;
        for (let i = 0; i < this.modoDeJuego+2; i++) {
            if (this.matriz[i][columna].getFicha().getPlayer() == 0) {
                ultimaFilaLibre = i;
            }
        }
        return ultimaFilaLibre;
    }
    
    hayGanador(ultimaFichaPuesta, fila, columna) {
        if ((this.checkeoHorizontal(ultimaFichaPuesta, fila, columna)) || (this.checkeoVertical(ultimaFichaPuesta, fila, columna)) || (this.checkeoDiagonales(ultimaFichaPuesta, fila, columna))) return true;
        else return false;
    }

    //CHEQUEO HORIZONTAL
    
    checkeoHorizontal(ultimaFichaPuesta, fila, columna) {
        let fichasEnLinea = this.checkeoIzquierda(ultimaFichaPuesta, fila, columna);
        if (fichasEnLinea == this.modoDeJuego) return true;
        else {
            if ((this.matriz[fila][columna+1] != null) && (this.matriz[fila][columna+1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
                if ((fichasEnLinea + this.checkeoDerecha(this.matriz[fila][columna+1].getFicha(), fila, columna+1)) >= this.modoDeJuego) return true;
            }
        }
        return false;
    }

    checkeoIzquierda(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila][columna-1] != null) && (this.matriz[fila][columna-1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila][columna-1] != null) {
                return this.checkeoIzquierda(this.matriz[fila][columna-1].getFicha(), fila, columna-1) + 1;
            } else return 1;
        } else return 1;
    }

    checkeoDerecha(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila][columna+1] != null) && (this.matriz[fila][columna+1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila][columna+1] != null) {
                return this.checkeoDerecha(this.matriz[fila][columna+1].getFicha(), fila, columna+1) + 1;
            } else return 1;
        } else return 1;
    }

    //CHEQUEO VERTICAL
    checkeoVertical(ultimaFichaPuesta, fila, columna) {
        let fichasEnLinea = this.checkeoAbajo(ultimaFichaPuesta, fila, columna);
        return (fichasEnLinea == this.modoDeJuego)
    }

    checkeoAbajo(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila+1] != null) && (this.matriz[fila+1][columna].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila+1][columna] != null) {
                return this.checkeoAbajo(this.matriz[fila+1][columna].getFicha(), fila+1, columna) + 1;
            } else return 1;
        } else return 1;
    }

    //CHEQUEO DIAGONALES
    checkeoDiagonales(ultimaFichaPuesta, fila, columna) {
        let fichasEnLinea = this.checkeoArribaIzquierda(ultimaFichaPuesta, fila, columna);
        if (fichasEnLinea == this.modoDeJuego) return true;
        else {
            if ((this.matriz[fila+1] != null) && (this.matriz[fila+1][columna+1] != null) && (this.matriz[fila+1][columna+1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
                if ((fichasEnLinea + this.checkeoAbajoDerecha(this.matriz[fila+1][columna+1].getFicha(), fila+1, columna+1)) >= this.modoDeJuego) return true;
            }
        }
        fichasEnLinea = this.checkeoArribaDerecha(ultimaFichaPuesta, fila, columna);
        if (fichasEnLinea == this.modoDeJuego) return true;
        else {
            if ((this.matriz[fila+1] != null) && (this.matriz[fila+1][columna-1] != null) && (this.matriz[fila+1][columna-1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
                if ((fichasEnLinea + this.checkeoAbajoIzquierda(this.matriz[fila+1][columna-1].getFicha(), fila+1, columna-1)) >= this.modoDeJuego) return true;
            }
        }
        return false;
    }

    checkeoArribaIzquierda(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila-1] != null) && (this.matriz[fila-1][columna-1] != null) && (this.matriz[fila-1][columna-1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila-1][columna-1] != null) {
                return this.checkeoArribaIzquierda(this.matriz[fila-1][columna-1].getFicha(), fila-1, columna-1) + 1;
            } else return 1;
        } else return 1;
    }

    checkeoAbajoDerecha(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila+1] != null) && (this.matriz[fila+1][columna+1] != null) && (this.matriz[fila+1][columna+1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila+1][columna+1] != null) {
                return this.checkeoAbajoDerecha(this.matriz[fila+1][columna+1].getFicha(), fila+1, columna+1) + 1;
            } else return 1;
        } else return 1;
    }

    checkeoArribaDerecha(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila-1] != null) && (this.matriz[fila-1][columna+1] != null) && (this.matriz[fila-1][columna+1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila-1][columna+1] != null) {
                return this.checkeoArribaDerecha(this.matriz[fila-1][columna+1].getFicha(), fila-1, columna+1) + 1;
            } else return 1;
        } else return 1;
    }

    checkeoAbajoIzquierda(ultimaFichaPuesta, fila, columna) {
        if ((this.matriz[fila+1] != null) && (this.matriz[fila+1][columna-1] != null) && (this.matriz[fila+1][columna-1].getFicha().getPlayer() == ultimaFichaPuesta.getPlayer())) {
            if (this.matriz[fila+1][columna-1] != null) {
                return this.checkeoAbajoIzquierda(this.matriz[fila+1][columna-1].getFicha(), fila+1, columna-1) + 1;
            } else return 1;
        } else return 1;
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    
}