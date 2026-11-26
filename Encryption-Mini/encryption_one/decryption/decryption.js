const form = document.getElementById('form');

const ltable = {
  'a': '83', 'b': '64', 'c': '11', 'd': '75', 'e': '52', 'f': '74',
  'g': '20', 'h': '35', 'i': '30', 'j': '87', 'k': '27', 'l': '06',
  'm': '36', 'n': '72', 'o': '51', 'p': '84', 'q': '00', 'r': '26',
  's': '04', 't': '24', 'u': '44', 'v': '66', 'w': '33', 'x': '58',
  'y': '23', 'z': '99', 'A': '93', 'B': '50', 'C': '77', 'D': '92',
  'E': '05', 'F': '09', 'G': '53', 'H': '98', 'I': '16', 'J': '76',
  'K': '39', 'L': '97', 'M': '01', 'N': '08', 'O': '57', 'P': '02',
  'Q': '94', 'R': '47', 'S': '45', 'T': '34', 'U': '69', 'V': '82',
  'W': '49', 'X': '95', 'Y': '31', 'Z': '71', ' ': '73', '.': '25',
  ',': '18', '?': '17', '!': '42', '\n': '14', '1': '13', '2': '59',
  '3': '90', '4': '55', '5': '81', '6': '65', '7': '43', '8': '07',
  '9': '29', '0': '80', '+': '63', '-': '37', '/': '79', '*': '86',
  '@': '21', '#': '28', '$': '85', '%': '22', '^': '56', '&': '96',
  '(': '78', ')': '48', ';': '46', ':': '10', "'": '32', '"': '70',
  '~': '67', '`': '68', '_': '12', '≈': '62', '\\': '15', '|': '60',
  '<': '88', '>': '40', '[': '38', ']': '89', '{': '61', '}': '41',
  '—': '54', '©': '03', '°': '91', '§': '19'
};

const reverseLookup = Object.fromEntries(
  Object.entries(ltable).map(([char, code]) => [code, char])
);

function numerize(text) {
  let result = "";
  for (const char of text) {
    if (ltable[char] === undefined) {
      throw new Error(`Unsupported character: ${JSON.stringify(char)}`);
    }
    result += ltable[char];
  }
  return result;
}

function makeSwap(nkey) {
  let d2;
  let d3;
  let d4;
  const d1 = nkey[0];
  nkey = nkey.slice(1);

  while (d2 === undefined) {
    if (nkey.length === 0 && d1 !== "0") d2 = "0";
    else if (nkey.length === 0) d2 = "1";
    else if (nkey[0] === d1) nkey = nkey.slice(1);
    else d2 = nkey[0];
  }

  while (d3 === undefined) {
    if (nkey.length === 0 && d1 !== "0" && d2 !== "0") d3 = "0";
    else if (nkey.length === 0 && d1 !== "1" && d2 !== "1") d3 = "1";
    else if (nkey.length === 0) d3 = "2";
    else if (nkey[0] === d1 || nkey[0] === d2) nkey = nkey.slice(1);
    else d3 = nkey[0];
  }

  while (d4 === undefined) {
    if (nkey.length === 0 && d1 !== "0" && d2 !== "0" && d3 !== "0") d4 = "0";
    else if (nkey.length === 0 && d1 !== "1" && d2 !== "1" && d3 !== "1") d4 = "1";
    else if (nkey.length === 0 && d1 !== "2" && d2 !== "2" && d3 !== "2") d4 = "2";
    else if (nkey.length === 0) d4 = "3";
    else if (nkey[0] === d1 || nkey[0] === d2 || nkey[0] === d3) nkey = nkey.slice(1);
    else d4 = nkey[0];
  }

  return {
    [d1]: d2,
    [d2]: d1,
    [d3]: d4,
    [d4]: d3
  };
}

function decrypt(ciphertext, key) {
  const nkey = numerize(key);
  if (nkey.length === 0) {
    throw new Error("The key is empty or contains unsupported characters.");
  }

  let numerizedResult = "";
  for (const char of ciphertext) {
    const code = ltable[char];
    if (code === undefined) {
      throw new Error(`Ciphertext contains unsupported character: ${JSON.stringify(char)}`);
    }
    numerizedResult += code;
  }

  const swap = makeSwap(nkey);
  const keyNumber = BigInt(nkey);
  if (keyNumber === 0n) {
    throw new Error("This key is numerically zero.");
  }

  const paddedCandidates = [numerizedResult];
  if (numerizedResult.startsWith("0")) {
    paddedCandidates.push(numerizedResult.slice(1));
  }

  const plaintextCandidates = new Set();
  for (const paddedCandidate of paddedCandidates) {
    let nproduct = "";
    for (const digit of paddedCandidate) {
      nproduct += swap[digit] ?? digit;
    }

    const product = nproduct.length === 0 ? 0n : BigInt(nproduct);
    if (product % keyNumber !== 0n) continue;

    let ntext = (product / keyNumber).toString();
    if (ntext.length % 2 !== 0) ntext = "0" + ntext;

    let plaintext = "";
    let valid = true;
    for (let index = 0; index < ntext.length; index += 2) {
      const char = reverseLookup[ntext.slice(index, index + 2)];
      if (char === undefined) {
        valid = false;
        break;
      }
      plaintext += char;
    }

    if (valid) plaintextCandidates.add(plaintext);
  }

  if (plaintextCandidates.size === 0) {
    throw new Error("This ciphertext cannot be decrypted with that key.");
  }

  return [...plaintextCandidates];
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const key = document.getElementById('key').value;
  const text = document.getElementById('text').value;
  const result = document.getElementById('result');
  const status = document.getElementById('status');

  try {
    const plaintexts = decrypt(text, key);
    result.textContent = plaintexts.length === 1
      ? plaintexts[0]
      : plaintexts.map((plaintext, index) => `Candidate ${index + 1}:\n${plaintext}`).join("\n\n");
    status.textContent = plaintexts.length > 1
      ? "The padding is ambiguous; review both possible results."
      : "";
  } catch (error) {
    result.textContent = "";
    status.textContent = error instanceof Error ? error.message : "Unable to decrypt text.";
  }
});
