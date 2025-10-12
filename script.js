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

// --- ONE TIME PAD ---
function otp(texto, chave) {
  let resultado = '';
  for (let i = 0; i < texto.length; i++) {
    const t = texto.charCodeAt(i);
    const k = chave.charCodeAt(i % chave.length);
    resultado += String.fromCharCode(t ^ k);
  }
  return btoa(resultado); // Exibe em Base64
}

// --- CIFRA DE HILL (2x2) ---
function hill(texto, chave, cifrar = true) {
  texto = texto.replace(/[^A-Z]/g, '');
  if (texto.length % 2 !== 0) texto += 'X';
  const nums = texto.split('').map(c => c.charCodeAt(0) - 65);

  const k = chave.replace(/[^0-9 ]/g, '').split(' ').map(Number);
  if (k.length !== 4) return 'A chave deve conter 4 números (matriz 2x2)';

  const det = (k[0] * k[3] - k[1] * k[2] + 26) % 26;
  const invDet = inversoMod(det, 26);
  if (invDet === -1) return 'Determinante não tem inverso módulo 26.';

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
