function criptografar() {
  const msg = document.getElementById('mensagem').value.toUpperCase();
  const chave = document.getElementById('chave').value.toUpperCase();
  const algoritmo = document.getElementById('algoritmo').value;
  let resultado = '';

  if (algoritmo === 'cesar') resultado = cesar(msg, parseInt(chave), true);
  else if (algoritmo === 'vigenere') resultado = vigenere(msg, chave, true);
  else if (algoritmo === 'hill') resultado = hill(msg, chave, true);
  else if (algoritmo === 'otp') resultado = otp(msg, chave);

  document.getElementById('saida').innerText = resultado;
}

function descriptografar() {
  const msg = document.getElementById('mensagem').value.toUpperCase();
  const chave = document.getElementById('chave').value.toUpperCase();
  const algoritmo = document.getElementById('algoritmo').value;
  let resultado = '';

  if (algoritmo === 'cesar') resultado = cesar(msg, parseInt(chave), false);
  else if (algoritmo === 'vigenere') resultado = vigenere(msg, chave, false);
  else if (algoritmo === 'hill') resultado = hill(msg, chave, false);
  else if (algoritmo === 'otp') resultado = otp(msg, chave);

  document.getElementById('saida').innerText = resultado;
}

// --- CIFRA DE CÉSAR ---
function cesar(texto, deslocamento = 3, cifrar = true) {
  if (isNaN(deslocamento)) deslocamento = 3;
  if (!cifrar) deslocamento = -deslocamento;
  return texto.replace(/[A-Z]/g, c =>
    String.fromCharCode(((c.charCodeAt(0) - 65 + deslocamento + 26) % 26) + 65)
  );
}

// --- CIFRA DE VIGENERE ---
function vigenere(texto, chave, cifrar = true) {
  // validação: pelo menos 4 palavras
  const palavras = texto.trim().split(/\s+/);
  if (palavras.length < 4) {
    return '❌ A mensagem deve conter pelo menos 4 palavras.';
  }

  let resultado = '';
  let j = 0;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (/[A-Z]/.test(c)) {
      const k = chave[j % chave.length].charCodeAt(0) - 65;
      const base = c.charCodeAt(0) - 65;
      const shift = cifrar ? (base + k) % 26 : (base - k + 26) % 26;
      resultado += String.fromCharCode(shift + 65);
      j++;
    } else resultado += c;
  }
  return resultado;
}

// --- ONE TIME PAD  ---
function otp(msg, chave) {
  // Verifica se a chave é menor que a mensagem
  if (chave.length < msg.length) {
    return '⚠️ A chave deve ser de tamanho maior ou igual ao da mensagem.';
  }

  const msgNums = msg.trim().split(' ').map(Number);
  const keyNums = chave.trim().split(' ').map(Number);


  // Verifica se são números válidos
  if (msgNums.some(isNaN) || keyNums.some(isNaN)) {
    return '❌ Mensagem e chave devem conter apenas números em base decimal.';
  }

  // Executa XOR
  const resultadoDec = msgNums.map((num, i) => num ^ keyNums[i]);
  const resultadoBin = resultadoDec.map(n => n.toString(2).padStart(8, '0'));

  let saida = '🔒 Resultado OTP:\n';
  saida += 'Decimal: ' + resultadoDec.join(' ') + '\n';
  saida += 'Binário: ' + resultadoBin.join(' ');
  return saida;
}


// --- CIFRA DE HILL ---
function hill(texto, chave, cifrar = true) {
  texto = texto.replace(/[^A-Z]/g, '');
  if (texto.length % 2 !== 0) texto += 'X';
  const nums = texto.split('').map(c => c.charCodeAt(0) - 65);

  const k = chave.replace(/[^0-9 ]/g, '').split(' ').map(Number);
  if (k.length !== 4) return '❌ A chave deve conter 4 números (matriz 2x2)';

  const det = (k[0] * k[3] - k[1] * k[2] + 26) % 26;
  const invDet = inversoMod(det, 26);
  if (invDet === -1) return '❌ Determinante não tem inverso módulo 26.';

  let matriz;
  if (cifrar) matriz = k;
  else {
    matriz = [
      (k[3] * invDet) % 26,
      ((-k[1] + 26) * invDet) % 26,
      ((-k[2] + 26) * invDet) % 26,
      (k[0] * invDet) % 26,
    ];
  }

  let resultado = '';
  for (let i = 0; i < nums.length; i += 2) {
    const [a, b] = [nums[i], nums[i + 1]];
    const x = (matriz[0] * a + matriz[1] * b) % 26;
    const y = (matriz[2] * a + matriz[3] * b) % 26;
    resultado += String.fromCharCode(x + 65) + String.fromCharCode(y + 65);
  }
  return resultado;
}

function inversoMod(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return -1;
}
