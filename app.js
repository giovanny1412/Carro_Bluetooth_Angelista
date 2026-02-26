// 1. Definir bloques
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

Blockly.Blocks['esperar_segundos'] = {
  init: function() {
    this.appendDummyInput().appendField("esperar")
        .appendField(new Blockly.FieldNumber(1), "SEC").appendField("seg");
    this.setPreviousStatement(true); this.setNextStatement(true);
    this.setColour(120);
  }
};

// 2. Generadores de código
Blockly.JavaScript['mover_carro'] = function(block) {
  return 'send("' + block.getFieldValue('DIR') + '");\n';
};

Blockly.JavaScript['esperar_segundos'] = function(block) {
  return 'await sleep(' + (block.getFieldValue('SEC') * 1000) + ');\n';
};

// 3. Bluetooth y Ejecución
let characteristic;

async function conectarBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['00001101-0000-1000-8000-00805f9b34fb']
        });
        const server = await device.gatt.connect();
        // Nota: En un ESP32 real, a veces el servicio UUID varía. 
        // Este es el estándar para SPP (Serial Port Profile).
        alert("Conectado a: " + device.name);
    } catch (e) { alert("Error: " + e); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function send(msg) {
    console.log("Enviando: " + msg);
    // Aquí iría la lógica de characteristic.writeValue() 
    // Para pruebas, lo veremos en la consola.
}

async function enviarPrograma() {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById('codigoVista').innerText = code;
    
    // Evalúa el código generado para enviarlo por Bluetooth
    try {
        eval('(async () => {' + code + '})()');
    } catch (e) { console.error(e); }
}

var workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});