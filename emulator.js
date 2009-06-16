if (typeof(console) == 'undefined') {
  console = {
    log: function() {
    }
  }
}

emulator = {
  init: function() {
    emulator.docURL = null
    emulator.participantId = Cookie.read('wave-id') || $random(100000000, 999999999)
    Cookie.write('wave-id', emulator.participantId)

    emulator.participantName = Cookie.read('wave-name') || prompt('Enter name (as will appear on the gadget participant list)')
    Cookie.write('wave-name', emulator.participantName)

    emulator.checkState.periodical(6000)
  },

  getJSON: function(url, callback, fullCallback) {
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
          url: emulator.docURL,
          method: 'PUT',
          data: '{}',
          onSuccess: emulator.checkState
        }).send()
      }
    }).send()
  },
  
  saveJSON: function(url, alter, callback) {
    emulator.getJSON(url, null /* we need only the full state */, function(state) {
      if (state.error)
        state = {}
 
      state = alter(state) || state

      new Request.JSON({
        url: url,
        method: 'PUT',
        data: JSON.encode(state),
        onFailure: function() {
          emulator.saveJSON(url, alter, callback)
        },
        onSuccess: callback
      }).send()
    })  
  },

  rpc: {},
  
  saveDelta: function(delta) {
    emulator.saveJSON(emulator.docURL, function(state) {
      for (var i in delta) {
        if (delta[i]) {
          state[i] = delta[i];
        } else {
          delete state[i]
        }
      }
    }, emulator.checkState)
  },
  
  onLoad: $empty,
  
  lastRev: null,

  stateHtml: function(state) {
    return $H(state).map(function(value, key) { 
      return '<p style="margin-bottom: 1px; margin-top: 3px;"><b>' + key + '</b>: ' + value + '</p>'
    }).getValues().join('').replace(/,/g, ',<wbr>')
  },

  participantHtml: function(participants) {
    return $H(participants).map(function(value) { 
      return '<p style="margin-bottom: 1px; margin-top: 3px;"><b>' + value.displayName + '</p>'
    }).getValues().join('').replace(/,/g, ',<wbr>')
  },

  addMe: function() {
    emulator.saveJSON(emulator.docURL, function(obj) {
      obj.a_participants = obj.a_participants || {}
      
      obj.a_participants[emulator.participantId] = {
        id: emulator.participantId, 
        displayName: emulator.participantName,
        thumbnailUrl: 'http://gadget-doc-examples.googlecode.com/svn/trunk/images/unknown.gif'
      }
    }, emulator.checkState)
  },

  addParticipant: function(participants) {
    participants = participants || {}
    console.log(participants)
  
    if (!participants[emulator.participantId])
      emulator.addMe()
    else {
      var ob = {myId: emulator.participantId, authorId: 0, participants: participants}    
      wave.receiveWaveParticipants_(ob)
    } 
  },

  checkState: function() {
    if (emulator.docURL) {
      emulator.getJSON(emulator.docURL, function(state, rev, participants) {
        if (rev != emulator.lastRev) {
          emulator.lastRev = rev
          $$('#state').set('html', emulator.stateHtml(state))
          $$('#participants').set('html', emulator.participantHtml(participants))
          wave.receiveState_(state)
          emulator.addParticipant(participants)
        }
      })
    }
  }
}

gadgets = {}
gadgets.util = {}

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
      emulator.checkState()
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
    
   
emulator.init()


window.top.emulator = emulator
window.top.gadgets = gadgets

