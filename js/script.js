var markov1 = {};
var markov2 = {};


function init(){
  var segmenter = new TinySegmenter();

  hackdayList.forEach(function(v){
    v.descSegs = segmenter.segment(v.desc);
    v.descSegs.push("$");
  });

  // make markov1
  hackdayList.forEach(function(v){
    var pre = "^";
    v.descSegs.forEach(function(s){
      var target = markov1[pre];
      if(target == undefined){
        target = {};
      }
      if(target[s] == undefined){
        target[s] = {weight: 0};
      }
      target[s].weight ++;
      markov1[pre] = target;

      pre = s;
    });
  });

  // make markov2
  hackdayList.forEach(function(v){
    var ppre = "^";
    var pre = "^";
    v.descSegs.forEach(function(s){
      var target = markov2[ppre];
      if(target == undefined){
        target = {};
      }
      if(target[pre] == undefined){
        target[pre] = {};
      }
      if(target[pre][s] == undefined){
        target[pre][s] = {weight: 0};
      }
      target[pre][s].weight ++;
      markov2[ppre] = target;

      ppre = pre;
      pre = s;
    });
  });
}

function getItems(assoc){
  var ret = [];
  for(var k in assoc){
    ret.push({key:k , value:assoc[k]});
  }
  return ret;
}
function choice(arr){
  var r = Math.floor(Math.random() * arr.length);
  return arr[r];
}
function getByWeight(assoc){
  var weightedItems = [];
  getItems(assoc).forEach(function(v){
    for(var i = 0; i < v.value.weight; i ++){
      weightedItems.push(v);
    }
  });
  return choice(weightedItems);
}

function mkRandom(){
  var target = "^";
  var candidates;
  var next;
  var result = [];

  while(true){
    candidates = markov1[target];
    next = getByWeight(candidates);
    console.log(next);
    target = next.key;
    if(target == "$"){
      break;
    }
    result.push(next);
  }

  var out = "";
  result.forEach(function(r){
    out += r.key
  });
  return out;
}

init();
var random = [];
for(var i = 0; i < 10; i ++){
  random.push(mkRandom());
}


var app = new Vue({
  el: '#app',
  data: {
    query: "",
    random: random,
  },
  computed: {
    result: function(){
      var result = [];
      var query = this.query;
      if(query.length > 0){
        // search
        hackdayList.forEach(function(v){
          if(v.title.indexOf(query) != -1 || v.desc.indexOf(query) != -1){
            result.push(v);
          }
        });
      }
      return result;
    },
  }
});
