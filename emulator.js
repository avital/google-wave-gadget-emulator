docId = null

getJSON = function(url, callback) {
  new Request.JSON({
    url: url,
    method: 'get',
    onSuccess: callback,
    onFailure: function() {
      new Request.JSON({
        url: 'db/' + docId,
        method: 'PUT',
        data: '{}',
        onSuccess: callback
      }).send()
    }
  }).send()
}

emulator = {
  rpc: {},
  
  saveDelta: function(delta) {
    getJSON('db/' + docId, function(state) {
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
          this.saveDelta(delta)
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
      checkState()
    }
    else if (cmd == 'wave_gadget_state') {
      emulator.saveDelta(params)      
    }
  }
}

checkState = function() {
  if (docId) {
    getJSON('db/' + docId, function(state) {
      if (!wave.getState() || state._rev != wave.getState().state_._rev) {
        wave.receiveState_(state)
      }
    })
  }
}

checkState.periodical(6000)


