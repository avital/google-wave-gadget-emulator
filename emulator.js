if (typeof(console) == 'undefined') {
  console = {
    log: function() {
    }
  }
}

docId = null
participantId = Cookie.read('wave-id') || $random(100000000, 999999999)
Cookie.write('wave-id', participantId)

participantName = Cookie.read('wave-name') || prompt('Enter name (as will appear on the gadget participant list)')
Cookie.write('wave-name', participantName)

getJSON = function(url, callback, fullCallback) {
  allCallbacks = function(obj) {
    if (fullCallback)
      fullCallback(obj)

    if (callback) {
      var rev = obj._rev
      delete obj._rev       
      delete obj._id
      
      var participants = obj.a_participants || {}
      delete obj.a_participants
      
      callback(obj, rev, participants)
    }
  }
    
  new Request.JSON({
    url: url,
    method: 'get',
    onSuccess: allCallbacks,
    onFailure: function() {
      new Request.JSON({
        url: 'db/' + docId,
        method: 'PUT',
        data: '{}',
        onSuccess: checkState
      }).send()
    }
  }).send()
}

saveJSON = function(url, alter, callback) {
  getJSON(url, null /* we need only the full state */, function(state) {
    if (state.error)
      state = {}
 
    state = alter(state) || state

    new Request.JSON({
      url: url,
      method: 'PUT',
      data: JSON.encode(state),
      onFailure: function() {
        saveJSON(url, alter, callback)
      },
      onSuccess: callback
    }).send()
  })
}

emulator = {
  rpc: {},
  
  saveDelta: function(delta) {
    saveJSON('db/' + docId, function(state) {
      for (var i in delta) {
        if (delta[i]) {
          state[i] = delta[i];
        } else {
          delete state[i]
        }
      }
    }, checkState)
  }
}

gadgets = {}
gadgets.util = {}

emulator.onLoad = $empty

gadgets.util.registerOnLoadHandler = function(f) {
  if (emulator.onLoad)
    emulator.onLoad()

  emulator.onLoad = f
}

gadgets.util.getUrlParameters = function() {
  return {wave: {}}
}

gadgets.rpc = {
  register: function(event, f) {
    console.log('register')
    console.log(event)
    console.log(f)
    console.log()
    emulator.rpc[event] = f
  },
  
  call: function(arg1, cmd, arg2, params) {
    if (cmd == 'wave_enable') {
      checkState()
    }
    else if (cmd == 'wave_gadget_state') {
      emulator.saveDelta(params)      
    }
    else {
      console.log('call')
      console.log(cmd)
      console.log(params)
      console.log()
    }
  }
}

lastRev = null

stateHtml = function(state) {
  return $H(state).map(function(value, key) { 
    return '<p style="margin-bottom: 1px; margin-top: 3px;"><b>' + key + '</b>: ' + value + '</p>'
  }).getValues().join('').replace(/,/g, ',<wbr>')
}

participantHtml = function(participants) {
  return $H(participants).map(function(value) { 
    return '<p style="margin-bottom: 1px; margin-top: 3px;"><b>' + value.displayName + '</p>'
  }).getValues().join('').replace(/,/g, ',<wbr>')
}

addMe = function() {
  saveJSON('db/' + docId, function(obj) {
    obj.a_participants = obj.a_participants || {}
      
    obj.a_participants[participantId] = {
      id: participantId, 
      displayName: participantName,
      thumbnailUrl: 'http://gadget-doc-examples.googlecode.com/svn/trunk/images/unknown.gif'
    }
  }, checkState)
}

addParticipant = function(participants) {
  participants = participants || {}
  console.log(participants)
  
  if (!participants[participantId])
    addMe()
  else {
    var ob = {myId: participantId, authorId: 0, participants: participants}    
    wave.receiveWaveParticipants_(ob)
  }
}

checkState = function() {
  if (docId) {
    getJSON('db/' + docId, function(state, rev, participants) {
      if (rev != lastRev) {
        lastRev = rev
        $('state').set('html', stateHtml(state))
        $('participants').set('html', participantHtml(participants))
        wave.receiveState_(state)
        addParticipant(participants)
      }
    })
  }
}

checkState.periodical(3000)


