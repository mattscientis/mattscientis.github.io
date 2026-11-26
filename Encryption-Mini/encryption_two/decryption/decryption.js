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
an=assigned number

swap=digits to be swapped for result B
d1-10=order of unique digits in nkey
*/

let key;
let text;
let ntext = "";
let nkey = "";
let resulta = "";
let tresult = "";
let resultb = "";
let swap;
let error = "";

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


//random number generator
function random(seed, iteration){
/*
>>>0 is used as modulo 2^32
Math.Imul is just multiplication modulo 2^32
^ is bitwise XOR
a>>>b moves a bitwise b digits, and discards what falls off
*/
while (iteration > 0) {
seed = seed >>>0;
let seeda = Math.imul(seed, 2851719395);
seeda = (seeda+1991331675)>>>0;
let seedb = Math.imul(seed, 3569943763);
seedb = (seedb+3331889845)>>>0;
let seedc = seeda^seedb;
seed = (seedc^(seedc>>>16))>>>0;
seed ^= (Math.imul(seeda, seedb)>>>0);
iteration = iteration-1;
};
seed = seed / (2**32)
return seed
};


//sets stops the refresh and copies the form
event.preventDefault();
key = document.getElementById('key').value;
text = document.getElementById('text').value;

//converts text into numbers
function numerize(thing, table) {
let nthing = "";
  while (thing.length > 0) {
  let fl = thing[0];
  let an = table[fl];
  if (an !== undefined) {
  nthing += an;
  }
  thing = thing.slice(1);
};
return nthing;
};


//turns two arrays into an object
function objectify(keys, values) {
let result = {};
for (let i = 0; i < keys.length; i++) {
let key = keys[i];
let value = values[i];
result[key] = value;
};
return result;
};


//makes a new lookup table
function gentable (table, seed) {
  let compatibles = Object.keys(table);
  let RNG = [];
  for (let i=100; i>0; i--){
    RNG.push(random (seed, i))
  };
  let i = 1;
  let nlist = {};
  for (const key of RNG) {
    nlist[key] = String(i % 100).padStart(2, "0");
    i++;
  };
  let thing = Object.values(nlist);
  let nnlist = objectify(compatibles, thing)
  return nnlist
};
nkey = numerize(key, ltable);
let ntable = gentable(ltable, nkey);

const rntable = {};
for (let char in ntable) {
  rntable[ntable[char]] = char;
};


//converts the text into numbers
ntext = numerize(text, ntable);
let nnkey = numerize(key, ntable);


//generates the swap table
function swapgen(seed) {
d1 = undefined; d2 = undefined; d3 = undefined; d4 = undefined; d5 = undefined;
d6 = undefined; d7 = undefined; d8 = undefined; d9 = undefined; d10 = undefined;
let tseed = seed;
let i = 1;
while (tseed.length > 0 && d10 === undefined){
  let thing = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];
  let fl = tseed [0];
  if (!thing.includes(fl)){
    if (d1 === undefined){
      d1 = fl
    } else if (d2 === undefined){
      d2 = fl
    } else if (d3 === undefined){
      d3 = fl
    } else if (d4 === undefined){
      d4 = fl
    } else if (d5 === undefined){
      d5 = fl
    } else if (d6 === undefined){
      d6 = fl
    } else if (d7 === undefined){
      d7 = fl
    } else if (d8 === undefined){
      d8 = fl
    } else if (d9 === undefined){
      d9 = fl
    } else if (d10 === undefined){
      d10 = fl
    }
  };
  tseed = tseed.slice(1);
};
let fl = "0";
while (d10 === undefined){
  let thing = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10]
  if (!thing.includes(fl)){
    if (d1 === undefined){
      d1 = fl
    } else if (d2 === undefined){
      d2 = fl
    } else if (d3 === undefined){
      d3 = fl
    } else if (d4 === undefined){
      d4 = fl
    } else if (d5 === undefined){
      d5 = fl
    } else if (d6 === undefined){
      d6 = fl
    } else if (d7 === undefined){
      d7 = fl
    } else if (d8 === undefined){
      d8 = fl
    } else if (d9 === undefined){
      d9 = fl
    } else if (d10 === undefined){
      d10 = fl
    }
  };
  fl = String(Number(fl) + 1);
}
swap = {
  [d1]: d2,
  [d2]: d1,
  [d3]: d4,
  [d4]: d3,
  [d5]: d6,
  [d6]: d5,
  [d7]: d8,
  [d8]: d7,
  [d9]: d10,
  [d10]: d9,
};
};

swapgen (nkey)


//undoes the swap
function doswap(seed){
let tempresult = "";
while (seed.length > 0) {
  let fl = seed[0];
  let an = swap[fl];
  if (an !== undefined) {
  tempresult += an;
  } else {
    tempresult += fl
  }
  seed = seed.slice(1);
};
return tempresult;
}
resulta = doswap(ntext)

//undoes the first swap
swapgen (nnkey)
resulta = doswap (resulta)

//undoes the first result
if (BigInt(resulta) % BigInt(nnkey) === 0n){
resultb = BigInt(resulta) / BigInt(nnkey) ;
} else if (BigInt(resulta.slice(1)) % BigInt(nnkey) === 0n){
resulta = resulta.slice(1);
resultb = BigInt(resulta) / BigInt(nnkey) ;
} else {
error = "Error"
}


//denumerizes the result
let nresult = resultb.toString();
if (nresult.length % 2 !== 0) {
  nresult = '0' + nresult;
}
while (nresult.length > 0) {
  let fl = nresult.slice(0,2);
  let an = rntable[fl];
  if (an !== undefined) {
  tresult += an;
  }
  nresult = nresult.slice(2);
};


document.getElementById("result").textContent = tresult;
document.getElementById("error").textContent = error;
});