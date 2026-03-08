function $(id){
 return document.getElementById(id)
}

let flashWords=[]
let flashIndex=0
let quizWords=[]

const animals = [
"dog","cat","parrot","bird","fish","tiger","lion",
"monkey","cow","pig","chicken","duck","goat",
"horse","sheep","elephant","mouse","rabbit"
]
// ======================
// TRA TỪ
// ======================

async function lookupWord(){

 const word=$("word").value.trim()

 if(!word){
  alert("Enter a word")
  return
 }

 try{

 const res=await fetch(
 `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
 )

 const data=await res.json()

 if(!data[0]){
  alert("Word not found")
  return
 }

 const phonetic=data[0].phonetic || ""
 const type=data[0].meanings[0].partOfSpeech
 const audio=data[0].phonetics.find(p=>p.audio)?.audio || ""

 $("phonetic").value=phonetic
 $("type").value=type

let viMeaning = await translateToVietnamese(word)

// nếu là động vật thì thêm "con"
if(animals.includes(word.toLowerCase()) && !viMeaning.startsWith("con ")){
 viMeaning = "con " + viMeaning
}

$("meaning").value = viMeaning

 if(audio){
  $("audioBox").innerHTML=
  `<button onclick="playAudio('${audio}')">Play Audio</button>`
 }

 }catch(e){
  alert("Lookup error")
 }

}


// ======================
// DỊCH
// ======================

async function translateToVietnamese(text){

 try{

 const res=await fetch(
 `https://api.mymemory.translated.net/get?q=${text}&langpair=en|vi`
 )

 const data=await res.json()

 return data.responseData.translatedText

 }catch(e){

 return text

 }

}


// ======================
// PHÁT ÂM
// ======================

function playAudio(url){

 const audio=new Audio(url)
 audio.play()

}


// ======================
// ADD WORD
// ======================

async function addWord(){

 const word=$("word").value
 const phonetic=$("phonetic").value
 const type=$("type").value
 const meaning=$("meaning").value

 if(!word||!meaning){
  alert("Missing data")
  return
 }

 await fetch("api/save_word.php",{

  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({word,phonetic,type,meaning})

 })

 $("word").value=""
 $("phonetic").value=""
 $("type").value=""
 $("meaning").value=""

 loadWords()
 loadStats()

}


// ======================
// WORD LIST
// ======================

async function loadWords(){

 const res=await fetch("api/get_word.php")
 const words=await res.json()

 const list=$("wordList")

 list.innerHTML=`
 <div class="word-header">
 <div>Word</div>
 <div>Phonetic</div>
 <div>Type</div>
 <div>Meaning</div>
 <div>Favorite</div>
 <div>Delete</div>
 </div>
 `

 words.slice(0,5).forEach(w=>{

 const div=document.createElement("div")

 div.className="word-item"

 div.innerHTML=`

<div>${w.word}</div>
<div>${w.phonetic}</div>
<div>${w.type}</div>
<div>${w.meaning}</div>

<button onclick="toggleFavorite(${w.id})">Favorite</button>
<button onclick="deleteWord(${w.id})">Delete</button>

 `

 list.appendChild(div)

 })

}


// ======================
// TOGGLE LIST
// ======================

function toggleList(){

 const list=$("wordList")

 if(list.style.display==="none"){

  list.style.display="block"
  loadWords()

 }else{

  list.style.display="none"

 }

}


// ======================
// QUIZ
// ======================

async function loadQuiz(){

 const res=await fetch("api/get_word.php")
 quizWords=await res.json()

 nextQuiz()

}

function nextQuiz(){

 if(quizWords.length<4)return

 const word=quizWords[Math.floor(Math.random()*quizWords.length)]

 $("quizQuestion").innerText=
 "Meaning of: "+word.word

 let options=[word.meaning]

 while(options.length<4){

 const random=
 quizWords[Math.floor(Math.random()*quizWords.length)].meaning

 if(!options.includes(random)){
  options.push(random)
 }

 }

 options.sort(()=>Math.random()-0.5)

 let html=""

 options.forEach(opt=>{

 html+=`
 <button onclick="checkAnswer('${opt}','${word.meaning}')">
 ${opt}
 </button>
 `

 })

 $("quizOptions").innerHTML=html

}

function checkAnswer(selected,correct){

 if(selected===correct){
  alert("Correct!")
 }else{
  alert("Wrong! Correct: "+correct)
 }

}


// ======================
// FLASHCARD
// ======================

async function loadFlashcards(){

 const res=await fetch("api/get_word.php")
 flashWords=await res.json()

 if(flashWords.length===0){
  alert("No words")
  return
 }

 flashIndex=0

 showFlashcard()

}

function showFlashcard(){

 const w=flashWords[flashIndex]

 $("cardFront").innerText=w.word
 $("cardBack").innerText=w.meaning

}

function flipCard(){

 const card=document.querySelector(".flashcard")

 card.classList.toggle("flip")

}

function nextFlashcard(){

 if(flashWords.length===0)return

 flashIndex++

 if(flashIndex>=flashWords.length){
  flashIndex=0
 }

 showFlashcard()

}


// ======================
// DELETE
// ======================

async function deleteWord(id){

 await fetch("api/delete_word.php",{

  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({id})

 })

 loadWords()
 loadStats()

}


// ======================
// FAVORITE
// ======================

async function toggleFavorite(id){

 await fetch("api/favorite_word.php",{

  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({id})

 })

 loadWords()
 loadStats()

}


// ======================
// SEARCH
// ======================

function searchWords(){

 const key=$("searchWord").value.toLowerCase()

 const items=document.querySelectorAll(".word-item")

 items.forEach(item=>{

 const text=item.innerText.toLowerCase()

 if(text.includes(key)){
  item.style.display="grid"
 }else{
  item.style.display="none"
 }

 })

}


// ======================
// DAILY WORD
// ======================

async function loadDailyWords(){

 const res=await fetch("api/daily_word.php")
 const words=await res.json()

 const box=$("dailyWords")

 box.innerHTML=""

 words.forEach(w=>{

 box.innerHTML+=`
 <div class="daily-card">
 <b>${w.word}</b>
 <p>${w.meaning}</p>
 </div>
 `

 })

}


// ======================
// STATS
// ======================

async function loadStats(){

 const res=await fetch("api/stats.php")
 const data=await res.json()

 $("totalWords").innerText=data.total
 $("favWords").innerText=data.favorite
 $("learnedWords").innerText=data.learned

}


// ======================
// LOAD PAGE
// ======================

window.onload=function(){

 loadWords()
 loadStats()
 loadQuiz()
 loadFlashcards()
 loadDailyWords()

}