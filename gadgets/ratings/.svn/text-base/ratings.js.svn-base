// Copyright 2009 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview ratings.js contains functions and utilities to
 * generate simple 1-5 star ratings and tally the result. 
 * @author a.s@google.com
 */
function saveValue(key, value) {
  var state = {};
  state[key] = value;
  wave.getState().submitDelta(state);
}
  
function savePercent(key, value) {
  var state = {};
  state[key] = Math.round(value);
  wave.getState().submitDelta(state);
}
  
function calcPercent(numStar, numVotes) {
  var percent = (numStar/numVotes)*100;
  return percent;
}
  
function setStars(selectedStar) {
  var state = wave.getState();
  showStars(selectedStar);
      
  if (validateVoter(selectedStar)) {
    //initialize or get latest value
    var numStar = [ ];
    for (var i = 1; i <= 5; ++i) {
       numStar[i] = parseInt(state.get(i+'star', '0'));
    }
      
    //set total number of votes
    var numVotes = parseInt(state.get('votes', '0')) + 1;
    saveValue('votes', numVotes);
      
    //set values for each star rating   
    if (selectedStar == 1) {
      saveValue('1star', numStar[1]+1);
      setPercentages(numStar[1]+1, numVotes, selectedStar);
    } else if (selectedStar == 2) {
      saveValue('2star', numStar[2]+1);
      setPercentages(numStar[2]+1, numVotes, selectedStar);
    } else if (selectedStar == 3) {
      saveValue('3star', numStar[3]+1);
      setPercentages(numStar[3]+1, numVotes, selectedStar);
    } else if (selectedStar == 4) {
      saveValue('4star', numStar[4]+1);
      setPercentages(numStar[4]+1, numVotes, selectedStar);
    } else if (selectedStar == 5) {
      saveValue('5star', numStar[5]+1);
      setPercentages(numStar[5]+1, numVotes, selectedStar);
    }
  } else {
    var errorMsg = 'You already voted';
    document.getElementById('error_msg').innerHTML = errorMsg;
  }
}
  
function validateVoter(selectedStar) {
  var viewer = wave.getViewer();
  var state = wave.getState();
  if (state.get(viewer.getId()) == null) {
    var voters = {};
    voters[viewer.getId()] = selectedStar;
    state.submitDelta(voters);
    return true;
  } else {
    return false;
  }
}
    
function setPercentages(numStar, numVotes, selectedStar) {
  var state = wave.getState();
  //initialize or get latest values
  var star_percentage = [ ];
  for (var i = 1; i <= 5; ++i) {
    star_percentage[i] = parseInt(state.get(i+'star_percentage', '0'));
  }
    
  if (selectedStar == 1) {
    savePercent('1star_percentage', calcPercent(numStar, numVotes));
    savePercent('2star_percentage', calcPercent(state.get('2star'), numVotes));
    savePercent('3star_percentage', calcPercent(state.get('3star'), numVotes));
    savePercent('4star_percentage', calcPercent(state.get('4star'), numVotes));
    savePercent('5star_percentage', calcPercent(state.get('5star'), numVotes));
  } else if (selectedStar == 2) {
    savePercent('1star_percentage', calcPercent(state.get('1star'), numVotes));
    savePercent('2star_percentage', calcPercent(numStar, numVotes));
    savePercent('3star_percentage', calcPercent(state.get('3star'), numVotes));
    savePercent('4star_percentage', calcPercent(state.get('4star'), numVotes));
    savePercent('5star_percentage', calcPercent(state.get('5star'), numVotes));
  } else if (selectedStar == 3) {
    savePercent('1star_percentage', calcPercent(state.get('1star'), numVotes));
    savePercent('2star_percentage', calcPercent(state.get('2star'), numVotes));
    savePercent('3star_percentage', calcPercent(numStar, numVotes));
    savePercent('4star_percentage', calcPercent(state.get('4star'), numVotes));
    savePercent('5star_percentage', calcPercent(state.get('5star'), numVotes));
  } else if (selectedStar == 4) {
    savePercent('1star_percentage', calcPercent(state.get('1star'), numVotes));
    savePercent('2star_percentage', calcPercent(state.get('2star'), numVotes));
    savePercent('3star_percentage', calcPercent(state.get('3star'), numVotes));
    savePercent('4star_percentage', calcPercent(numStar, numVotes));
    savePercent('5star_percentage', calcPercent(state.get('5star'), numVotes));
  } else if (selectedStar == 5) {
    savePercent('1star_percentage', calcPercent(state.get('1star'), numVotes));
    savePercent('2star_percentage', calcPercent(state.get('2star'), numVotes));
    savePercent('3star_percentage', calcPercent(state.get('3star'), numVotes));
    savePercent('4star_percentage', calcPercent(state.get('4star'), numVotes));
    savePercent('5star_percentage', calcPercent(numStar, numVotes));
  }
}
 
function showStars(numStars) {
  var _rating_star_names = [ '','Poor','Below average','Average','Above average','Excellent!' ];
  var img_rate_star_on = new Image();
  img_rate_star_on.src = 'http://pesta.appspot.com/gadgets/ratings/rate_star_on.gif';
  var img_rate_star_off = new Image();
  img_rate_star_off.src = 'http://pesta.appspot.com/gadgets/ratings/rate_star_off.gif';
  var img_star_on = new Image();
  img_star_on.src = 'http://pesta.appspot.com/gadgets/ratings/small_star_on.gif';
  var img_star_off = new Image();
  img_star_off.src = 'http://pesta.appspot.com/gadgets/ratings/small_star_off.gif';
    
  if (!numStars) {
    numStars = 0;
  }
  for (var i = 1; i <= 5; ++i) {
    var star_elem = _gel('star'+i);
    if (!star_elem) {
      continue;
    }
    if (numStars >= i) {
      star_elem.src = img_rate_star_on.src;
    } else {
      star_elem.src = img_rate_star_off.src;
    }
  }
  var star_name = _gel('star_name');
  if (star_name && numStars >= 0 && numStars < _rating_star_names.length) {
    star_name.innerHTML = _rating_star_names[numStars];
  }
}
  
function stateChanged(state) {
  if (wave.getState().get('votes')) {
    document.getElementById('five_star_percentage').innerHTML = 
        wave.getState().get('5star_percentage') + '%';
    document.getElementById('four_star_percentage').innerHTML = 
        wave.getState().get('4star_percentage') + '%';
    document.getElementById('three_star_percentage').innerHTML = 
        wave.getState().get('3star_percentage') + '%';
    document.getElementById('two_star_percentage').innerHTML = 
        wave.getState().get('2star_percentage') + '%';
    document.getElementById('one_star_percentage').innerHTML = 
        wave.getState().get('1star_percentage') + '%';
    document.getElementById('total_votes').innerHTML = 
        wave.getState().get('votes');
     
    if (wave.getState().get('5star')) {
      document.getElementById('td5').title = 
          wave.getState().get('5star_percentage') + '%';
      document.getElementById('div5').style.width= 
          wave.getState().get('5star_percentage') + '%';
      document.getElementById('five_star').innerHTML = 
          '(' + wave.getState().get('5star') + ')';
    }
      
    if (wave.getState().get('4star')) {
      document.getElementById('td4').title = 
          wave.getState().get('4star_percentage') + '%';
      document.getElementById('div4').style.width= 
          wave.getState().get('4star_percentage') + '%';
      document.getElementById('four_star').innerHTML = 
          '(' + wave.getState().get('4star') + ')';
    }
      
    if (wave.getState().get('3star')) {
      document.getElementById('td3').title = 
          wave.getState().get('3star_percentage') + '%';
      document.getElementById('div3').style.width= 
          wave.getState().get('3star_percentage') + '%';
      document.getElementById('three_star').innerHTML = 
          '(' + wave.getState().get('3star') + ')';
    }
      
    if (wave.getState().get('2star')) {
      document.getElementById('td2').title = 
          wave.getState().get('2star_percentage') + '%';
      document.getElementById('div2').style.width= 
          wave.getState().get('2star_percentage') + '%';
      document.getElementById('two_star').innerHTML = 
          '(' + wave.getState().get('2star') + ')';
    }
      
    if (wave.getState().get('1star')) {
      document.getElementById('td1').title = 
          wave.getState().get('1star_percentage') + '%';
      document.getElementById('div1').style.width= 
          wave.getState().get('1star_percentage') + '%';
      document.getElementById('one_star').innerHTML = 
          '(' + wave.getState().get('1star') + ')';
    }
  }
}

function main() {
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(stateChanged);
  }
}
gadgets.util.registerOnLoadHandler(main);