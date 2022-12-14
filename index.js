let body = document.body
let grid = document.getElementById("grid")
let title  = document.getElementById("title")
let score_display = document.getElementById("score")
let suspects_img_links = ["./images/Banana-Single.jpeg"]
let options = ["scale", "translate", "rotate"]
let presets = [[1.7, 0.5], [35,30], [70, 60]]
let opp_presets = [[0.7, 0.5], [-35, 30], [-70, 60]]
let inverses = [1, 0, 0]
let score = 100
let diff = ""

let seasy_button = document.getElementById("seasy")
let easy_button = document.getElementById("easy")
let med_button = document.getElementById("med")
let hard_button = document.getElementById("hard")
let shard_button = document.getElementById("super_hard")
let chall_button = document.getElementById("challenging")
let imp_button = document.getElementById("imp")
let option = document.getElementById("option")
let desc = document.getElementById("description")
let back_button = document.getElementById("back")
let retry_button = document.getElementById("retry")
let win_cont = document.getElementById("win")

seasy_button.onclick = ()=>{start("seasy")}
easy_button.onclick = ()=>{start("easy")}
med_button.onclick = () => {start("med")}
hard_button.onclick = () => {start("hard")}
shard_button.onclick = () => {start("shard")}
chall_button.onclick = () => {start("chall")}
imp_button.onclick = () => {start("imp")}
back_button.onclick = () => {home()}
retry_button.onclick = () => {home();start(diff)}

var interval = {
   // to keep a reference to all the intervals
   intervals : new Set(),
   
   // create another interval
   make(...args) {
       var newInterval = setInterval(...args);
       this.intervals.add(newInterval);
       return newInterval;
   },

   // clear a single interval
   clear(id) {
       this.intervals.delete(id);
       return clearInterval(id);
   },

   // clear all intervals
   clearAll() {
       for (var id of this.intervals) {
           this.clear(id);
       }
   }
};

var timeout = {
   // to keep a reference to all the intervals
   timeouts : new Set(),
   
   // create another interval
   make(...args) {
       var newtimeout = setTimeout(...args);
       this.timeouts.add(newtimeout);
       return newtimeout;
   },

   // clear a single interval
   clear(id) {
       this.timeouts.delete(id);
       return clearTimeout(id);
   },

   // clear all intervals
   clearAll() {
       for (var id of this.timeouts) {
           this.clear(id);
       }
   }
};

function random_change(){
   let which = Math.floor(Math.random()*options.length)
   let coin = Math.floor(Math.random()*2)
   let preset_used = presets[which]
   switch (coin) {
      case 0:
         preset_used = opp_presets[which]
         break;
      default:
         break;
   }
   switch (which) {
      case 0:
         return [options[which], [["scale("],[")"]],preset_used, inverses[which]]
      case 1:
         return [options[which], [["translate("],["px,0)"]],preset_used, inverses[which]]
      case 2:
         return [options[which], [["rotate("],["deg)"]],preset_used, inverses[which]]
      default:
         break;
   }
}


function fill_grid(size){
   let choice = random_change()
   let imp_index = Math.floor(Math.random() * size *size)
   for (let index = 0; index < size*size; index++) {
      const new_img = document.createElement("img")
      const this_id = "img" + index.toString()
      new_img.id = this_id
      new_img.src = suspects_img_links[0]
      if (index == imp_index){
         switch (Math.floor(Math.random()*2)) {
            case 0:
               timeout.make(()=>{do_effect(choice[1], choice[2][0]-choice[2][1], choice[3], this_id)},random_interval(500, 3000))
               break;
            case 1:
               timeout.make(()=>{do_effect(choice[1], choice[2][0]+choice[2][1], choice[3], this_id)},random_interval(500, 3000))
            default:
               break;
         }
      } else {
         timeout.make(()=>{do_effect(choice[1], choice[2][0], choice[3], this_id)},random_interval(500, 3000))
      }
      new_img.addEventListener('click', e=>{is_impostor(index == imp_index)})
      grid.appendChild(new_img)
   }
   timed_score = interval.make(()=>{change_score(1)},5000)
}



function random_interval(start,end) {
   return Math.random() * (end-start) + start
}

function do_effect(todo, amt, inv, id) {
   elem = document.getElementById(id)
   elem.style.transform = todo[0]+amt.toString()+todo[1]
   timeout.make(()=>{do_effect(todo, amt, inv, id)},random_interval(500, 3000))
   timeout.make(()=>{clear(todo, inv, id)}, 200)
}

function clear(todo, inv, id) {
   elem = document.getElementById(id)
   elem.style.transform = todo[0]+inv.toString()+todo[1]
}

function is_impostor(impostor){
   if (impostor){
      win()
   }  else {
      title.innerHTML = "wrong pick!!"
      body.style.backgroundColor = "#ff6666"
      setTimeout(()=>{body.style.backgroundColor="white"; title.innerHTML = "Who's the impostor"},1000)
      change_score(5)
   }
}

function win(){
   title.innerHTML = "Correct!"
   body.style.backgroundColor = "green"
   interval.clear(timed_score)
   win_cont.style.display = "flex"
}

function change_score(amt) {
   score -= amt
   score_display.innerHTML = "Score: " + score.toString()
}


function start(difficulty) {
   score = 100
   score_display.innerHTML = "Score: " + score.toString()
   switch (difficulty) {
      case "seasy":
         diff = "seasy"
         grid.classList = "xsmall"
         fill_grid(3)
         break;
      case "easy":
         diff = "easy"
         grid.classList = "small"
         fill_grid(4)
         break;
      case "med":
         diff = "med"
         grid.classList = "medium"
         fill_grid(5)
         break;
      case "hard":
         diff = "hard"
         grid.classList = "large"
         fill_grid(6)
         break;
      case "shard":
         diff = "shard"
         grid.classList = "xlarge"
         fill_grid(8)
         break;
      case "chall":
         diff = "chall"
         grid.classList = "xxlarge"
         fill_grid(10)
         break;
      case "imp":
         diff = "imp"
         grid.classList = "imp"
         fill_grid(20)
         break;
      default:
         break;
   }
   option.style.display = "none"
   desc.style.display = "none"
   score_display.style.display = "block"
   back_button.style.display = "block"
}

function home() {
   option.style.display = "flex"
   desc.style.display = "block"
   score_display.style.display = "none"
   back_button.style.display = "none"
   title.innerHTML = "Who's the impostor"
   body.style.backgroundColor = "white"
   win_cont.style.display = "none"
   interval.clearAll()
   timeout.clearAll()
   grid.innerHTML = ''
}