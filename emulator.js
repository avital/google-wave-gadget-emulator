docId = null

getJSON = function(url, callback, fullCallback) {
  allCallbacks = function(obj) {
    if (fullCallback)
      fullCallback(obj)

    if (callback) {
      var rev = obj._rev
      delete obj._rev       
      delete obj._id
      callback(obj, rev)
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

emulator = {
  rpc: {},
  
  sendParticipants: function() {
    var ob = {myId: 0, authorId: 0, participants: [{
      myId: 0,
      id: 0,
      displayName: 'test',
      thumbnailUrl: 'http://gadget-doc-examples.googlecode.com/svn/trunk/images/unknown.gif'
    }]}
    
    this.rpc['wave_participants'](ob)
  },

  saveDelta: function(delta) {
    getJSON('db/' + docId, null /* we need only the full state */, function(state) {
      if (state.error)
        state = {}
 
      for (var i in delta) {
        if (delta[i]) {
          state[i] = delta[i];
        } else {
          delete state[i]
        }
      }

      new Request.JSON({
        url: 'db/' + docId,
        method: 'PUT',
        data: JSON.encode(state),
        onFailure: function() {
          emulator.saveDelta(delta)
        },
        onSuccess: function() {
          checkState()
        }
      }).send()
    })
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
    emulator.rpc[event] = f
  },
  
  call: function(arg1, cmd, arg2, params) {
    if (cmd == 'wave_enable') {
      emulator.sendParticipants()
      checkState()
    }
    else if (cmd == 'wave_gadget_state') {
      emulator.saveDelta(params)      
    }
  }
}

lastRev = null;

stateHtml = function(state) {
  return $H(state).map(function(value, key) { 
    return '<p style="margin-bottom: 1px; margin-top: 3px;"><b>' + key + '</b>: ' + value + '</p>'
  }).getValues().join('').replace(/,/g, ',<wbr>')
}

checkState = function() {
  if (docId) {
    getJSON('db/' + docId, function(state, rev) {
      if (rev != lastRev) {
        lastRev = rev
        $('state').set('html', stateHtml(state))
        wave.receiveState_(state)
      }
    })
  }
}

checkState.periodical(6000)


