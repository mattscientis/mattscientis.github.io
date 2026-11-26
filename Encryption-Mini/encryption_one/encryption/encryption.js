//the code waits until you give the form
const form = document.getElementById('form');
form.addEventListener('submit', function(event) {


/*
list of variables
key=encryption key
text=text to be encrypted
ntext/nkey=numerized text and key
form=the form (I'm not exactly sure why we need this)

resulta=reult of first encryption layer
nresulta=resulta in a normal variable
resultb=result after second layer
nresult=result in a normal variable
tresult=unnumerized result

ltable=lookup table
rltable=reverse lookup table

fl=first letter
an=(equivalent???) number

swap=digits to be swapped for result B
d1=first digit of nkey
d2=second unique digit of nkey
d3=third unique digit of nkey
d4=fourth unique digit of nkey
*/

let key;
let text;
let ntext = "";
let nkey = "";
let resulta;
let tresult = "";
let resultb = "";


const ltable = {
  'a': '83',
  'b': '64',
  'c': '11',
  'd': '75',
  'e': '52',
  'f': '74',
  'g': '20',
  'h': '35',
  'i': '30',
  'j': '87',
  'k': '27',
  'l': '06',
  'm': '36',
  'n': '72',
  'o': '51',
  'p': '84',
  'q': '00',
  'r': '26',
  's': '04',
  't': '24',
  'u': '44',
  'v': '66',
  'w': '33',
  'x': '58',
  'y': '23',
  'z': '99',
  'A': '93',
  'B': '50',
  'C': '77',
  'D': '92',
  'E': '05',
  'F': '09',
  'G': '53',
  'H': '98',
  'I': '16',
  'J': '76',
  'K': '39',
  'L': '97',
  'M': '01',
  'N': '08',
  'O': '57',
  'P': '02',
  'Q': '94',
  'R': '47',
  'S': '45',
  'T': '34',
  'U': '69',
  'V': '82',
  'W': '49',
  'X': '95',
  'Y': '31',
  'Z': '71',
  ' ': '73',
  '.': '25',
  ',': '18',
  '?': '17',
  '!': '42',
  '\n': '14',
  '1': '13',
  '2': '59',
  '3': '90',
  '4': '55',
  '5': '81',
  '6': '65',
  '7': '43',
  '8': '07',
  '9': '29',
  '0': '80',
  '+': '63',
  '-': '37',
  '/': '79',
  '*': '86',
  '@': '21',
  '#': '28',
  '$': '85',
  '%': '22',
  '^': '56',
  '&': '96',
  '(': '78',
  ')': '48',
  ';': '46',
  ':': '10',
  '\'': '32',
  '"': '70',
  '~': '67',
  '`': '68',
  '_': '12',
  '≈': '62',
  '\\': '15',
  '|': '60',
  '<': '88',
  '>': '40',
  '[': '38',
  ']': '89',
  '{': '61',
  '}': '41',
  '—': '54',
  '©': '03',
  '°': '91',
  '§': '19',
};

const rltable = {};
for (let char in ltable) {
  rltable[ltable[char]] = char;
}


//sets stops the refresh and copies the form
event.preventDefault();
key = document.getElementById('key').value;
text = document.getElementById('text').value;


//converts the text into numbers
while (text.length > 0) {
  let fl = text[0];
  let an = ltable[fl];
  if (an !== undefined) {
  ntext += an;
  }
  text = text.slice(1);
};

while (key.length > 0) {
  let fl = key[0];
  let an = ltable[fl];
  if (an !== undefined) {
  nkey += an;
  }
  key = key.slice(1);
};


//makes the first result
resulta = BigInt(ntext) * BigInt(nkey) ;
let nresulta = resulta.toString();


//makes the swap table
let d2, d3, d4;
let d1 = nkey[0]
nkey = nkey.slice(1);

while (d2===undefined) {
if (nkey.length===0 && d1!=="0") {
  d2="0"
} else if (nkey.length===0) {d2="1"}
  else if (nkey[0]===d1) {
  nkey = nkey.slice(1);
} else {d2 = nkey[0]}
}

while (d3===undefined) {
if (nkey.length===0 && d1!=="0" && d2!=="0") {
  d3="0"
} else if (nkey.length===0 && d1!=="1" && d2!=="1") {
  d3="1"
} else if (nkey.length===0) {d3="2"}
  else if (nkey[0]===d1) {
  nkey = nkey.slice(1);
} else if (nkey[0]===d2) {
  nkey = nkey.slice(1);
} else {d3 = nkey[0]}
}

while (d4===undefined) {
if (nkey.length===0 && d1!=="0" && d2!=="0" && d3!=="0") {
  d4="0"
} else if (nkey.length===0 && d1!=="1" && d2!=="1" && d3!=="1") {
  d4="1"
} else if (nkey.length===0 && d1!=="2" && d2!=="2" && d3!=="2") {
  d4="2"
} else if (nkey.length===0) {d4="3"}
  else if (nkey[0]===d1) {
  nkey = nkey.slice(1);
} else if (nkey[0]===d2) {
  nkey = nkey.slice(1);
} else if (nkey[0]===d3) {
  nkey = nkey.slice(1);
} else {d4 = nkey[0]}
}

const swap = {
  [d1]: d2,
  [d2]: d1,
  [d3]: d4,
  [d4]: d3
}


//does the swap
while (nresulta.length > 0) {
  let fl = nresulta[0];
  let an = swap[fl];
  if (an !== undefined) {
  resultb += an;
  } else {
    resultb += fl
  }
  nresulta = nresulta.slice(1);
};



let nresult = resultb.toString();
if (nresult.length % 2 !== 0) {
  nresult = '0' + nresult;
}

while (nresult.length > 0) {
  let fl = nresult.slice(0,2);
  let an = rltable[fl];
  if (an !== undefined) {
  tresult += an;
  }
  nresult = nresult.slice(2);
};


document.getElementById("result").textContent = tresult;
});