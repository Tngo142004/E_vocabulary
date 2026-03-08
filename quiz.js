function $(id){
 return document.getElementById(id)
}

let words=[]
let score=0
let streak=0
let correctAnswer=""
let currentIndex=0
function startQuiz(){

 $("start-screen").style.display="none"
 $("quiz-screen").style.display="block"

 loadQuiz()

}

async function loadQuiz(){

 const res=await fetch("api/get_word.php")
 words=await res.json()
words.sort(()    => Math.random()-0.5)
currentIndex=0;
 nextQuiz()

}

function nextQuiz(){

 if(words.length<4)return

 if(currentIndex >= words.length){
alert("Quiz Finished!")
return
}

const w = words[currentIndex]
currentIndex++

 correctAnswer=w.meaning

 $("question").innerText=
 "Meaning of: "+w.word

 let options=[w.meaning]

 while(options.length<4){

 let random=
 words[Math.floor(Math.random()*words.length)].meaning

 if(!options.includes(random)){
  options.push(random)
 }

 }

 options.sort(()=>Math.random()-0.5)

 let html=""

 options.forEach(opt=>{

 html+=`
 <button onclick="checkAnswer('${opt}')">
 ${opt}
 </button>
 `

 })

 $("options").innerHTML=html

}


function checkAnswer(selected){

const feedback = $("feedback")

if(selected===correctAnswer){

score+=10
streak++

feedback.innerText = "+10 Correct!"
feedback.className="correct"

}else{

streak=0

feedback.innerText = "Wrong!"
feedback.className="wrong"

}

$("score").innerText=score
$("streak").innerText=streak

setTimeout(()=>{
feedback.innerText=""
nextQuiz()
},1000)

}