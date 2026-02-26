// --- 1. Definición de Bloques ---

Blockly.Blocks['mover_carro'] = {
  init: function() {
    this.appendDummyInput().appendField("Mover")
        .appendField(new Blockly.FieldDropdown([
            ["adelante", "FORWARD"], ["atrás", "BACKWARD"], 
            ["derecha", "RIGHT"], ["izquierda", "LEFT"], ["detener", "STOP"]
        ]), "DIR");
    this.setPreviousStatement(true); this.setNextStatement(true);
    this.setColour(230);
  }
};

// NUEVO: Bloque de Esperar
Blockly.Blocks['esperar_segundos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("esperar")
        .appendField(new Blockly.FieldNumber(1, 0.1), "SEG")
        .appendField("segundos");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  }
};

// --- 2. Generadores de Código C++ (Simulado para ejecución Web) ---

Blockly.JavaScript['mover_carro'] = function(block) {
  var dir = block.getFieldValue('DIR');
  return `await enviar("${dir}");\n`; // Usamos await para que respete el orden
};

Blockly.JavaScript['esperar_segundos'] = function(block) {
  var segundos = block.getFieldValue('SEG');
  var ms = segundos * 1000;
  return `await esperar(${ms});\n`; // Pausa la ejecución en la web
};

// --- 3. Funciones de Control y Bluetooth ---

let characteristicBase;
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

// Función para crear pausas de tiempo
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

async function conectarBLE() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'Carro_Bloques_BLE' }],
            optionalServices: [SERVICE_UUID]
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        characteristicBase = await service.getCharacteristic(CHARACTERISTIC_UUID);
        alert("✅ Conectado al Carro");
    } catch (e) {
        alert("Error de conexión: " + e);
    }
}

async function enviar(msg) {
    if (characteristicBase) {
        const encoder = new TextEncoder();
        await characteristicBase.writeValue(encoder.encode(msg));
        console.log("Enviado: " + msg);
    } else {
        console.error("No hay conexión BLE");
    }
}

// Función principal para ejecutar los bloques
async function enviarPrograma() {
    // Obtenemos el código de los bloques
    const codigoDeBloques = Blockly.JavaScript.workspaceToCode(workspace);
    
    // Lo envolvemos en una función asíncrona para que 'await' funcione
    const programaCompleto = `(async () => { 
        ${codigoDeBloques} 
        await enviar("STOP"); // Detener al finalizar por seguridad
        console.log("Programa terminado");
    })();`;

    try {
        eval(programaCompleto); 
    } catch (e) {
        console.error("Error al ejecutar bloques: " + e);
    }
}

// Inicializar Blockly
var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});
