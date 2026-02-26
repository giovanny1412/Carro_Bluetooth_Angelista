// --- 1. DEFINICIÓN DE BLOQUES ---
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
        .appendField(new Blockly.FieldNumber(1, 0.1), "SEG").appendField("segundos");
    this.setPreviousStatement(true); this.setNextStatement(true);
    this.setColour(120);
  }
};

// --- 2. GENERADORES DE CÓDIGO (La solución al error) ---

// Importante: Si usas la versión comprimida moderna, se hace así:
const javascriptGenerator = Blockly.JavaScript; 

javascriptGenerator['mover_carro'] = function(block) {
  var dir = block.getFieldValue('DIR');
  return `await enviar("${dir}");\n`;
};

javascriptGenerator['esperar_segundos'] = function(block) {
  var segundos = block.getFieldValue('SEG');
  return `await esperar(${segundos * 1000});\n`;
};

// Si usas el bloque de "repeat", también necesita su generador
javascriptGenerator['controls_repeat_ext'] = function(block) {
  var repeats = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
  var branch = javascriptGenerator.statementToCode(block, 'DO');
  var code = `for (var i = 0; i < ${repeats}; i++) {\n${branch}}\n`;
  return code;
};
