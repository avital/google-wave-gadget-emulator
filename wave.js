var wave = wave || {};
wave.Callback = function(a, b) {
  this.callback_ = a;
  this.context_ = b || null
};
wave.Callback.prototype.invoke = function() {
  if(this.callback_) {
    var a = Array.prototype.slice.call(wave.Callback.prototype.invoke.arguments, 0);
    this.callback_.apply(this.context_, a)
  }
};
wave.Mode = {UNKNOWN:0, VIEW:1, EDIT:2, DIFF_ON_OPEN:3, PLAYBACK:4};
wave.PARAM_NAME_ = "wave";
wave.viewer_ = null;
wave.host_ = null;
wave.participants_ = [];
wave.participantMap_ = {};
wave.state_ = null;
wave.stateCallback_ = new wave.Callback(null);
wave.participantCallback_ = new wave.Callback(null);
wave.inWaveContainer_ = false;wave.util = wave.util || {};
wave.util.SPACES = "                                                 ";
wave.util.toSpaces_ = function(a) {
  return wave.util.SPACES.substring(0, a * 2)
};
wave.util.isArray_ = function(a) {
  try {
    return a && typeof a.length == "number"
  }catch(b) {
    return false
  }
};
wave.util.printJson = function(a, b, e) {
  if(!a || typeof a.valueOf() != "object") {
    if(typeof a == "string")return"'" + a + "'";
    else if(a instanceof Function)return"[function]";
    return"" + a
  }var c = [], f = wave.util.isArray_(a), d = f ? "[]" : "{}", h = b ? "\n" : "", k = b ? " " : "", l = 0, g = e || 1;
  b || (g = 0);
  c.push(d.charAt(0));
  for(var i in a) {
    var j = a[i];
    l++ > 0 && c.push(", ");
    if(f)c.push(wave.util.printJson(j, b, g + 1));
    else {
      c.push(h);
      c.push(wave.util.toSpaces_(g));
      c.push(i + ": ");
      c.push(k);
      c.push(wave.util.printJson(j, b, g + 1))
    }
  }if(!f) {
    c.push(h);
    c.push(wave.util.toSpaces_(g - 1))
  }c.push(d.charAt(1));
  return c.join("")
};wave.Participant = function(a, b, e) {
  this.id_ = a || "";
  this.displayName_ = b || "";
  this.thumbnailUrl_ = e || ""
};
wave.Participant.prototype.getId = function() {
  return this.id_
};
wave.Participant.prototype.getDisplayName = function() {
  return this.displayName_
};
wave.Participant.prototype.getThumbnailUrl = function() {
  return this.thumbnailUrl_
};
wave.Participant.fromJson_ = function(a) {
  var b = new wave.Participant;
  b.id_ = a.id;
  b.displayName_ = a.displayName;
  b.thumbnailUrl_ = a.thumbnailUrl;
  return b
};wave.State = function() {
  this.setState_(null)
};
wave.State.prototype.get = function(a, b) {
  return this.state_[a] || b || null
};
wave.State.prototype.getKeys = function() {
  var a = [];
  for(var b in this.state_)a.push(b);
  return a
};
wave.State.prototype.submitDelta = function(a) {
  gadgets.rpc.call(null, "wave_gadget_state", null, a)
};
wave.State.prototype.submitValue = function(a, b) {
  var e = {};
  e[a] = b;
  this.submitDelta(e)
};
wave.State.prototype.setState_ = function(a) {
  this.state_ = a || {}
};
wave.State.prototype.toString = function() {
  return wave.util.printJson(this.state_, true)
};wave.checkWaveContainer_ = function() {
  var a = gadgets.util.getUrlParameters();
  wave.inWaveContainer_ = a.hasOwnProperty(wave.PARAM_NAME_) && a[wave.PARAM_NAME_]
};
wave.isInWaveContainer = function() {
  return wave.inWaveContainer_
};
wave.receiveWaveParticipants_ = function(a) {
  wave.viewer_ = null;
  wave.host_ = null;
  wave.participants_ = [];
  wave.participantMap_ = {};
  var b = a.myId, e = a.authorId, c = a.participants;
  for(var f in c) {
    var d = wave.Participant.fromJson_(c[f]);
    if(f == b)wave.viewer_ = d;
    if(f == e)wave.host_ = d;
    wave.participants_.push(d);
    wave.participantMap_[f] = d
  }if(!wave.viewer_ && b) {
    d = new wave.Participant(b, b);
    wave.viewer_ = d;
    wave.participants_.push(d);
    wave.participantMap_[b] = d
  }wave.participantCallback_.invoke(wave.participants_)
};
wave.receiveState_ = function(a) {
  wave.state_ = wave.state_ || new wave.State;
  wave.state_.setState_(a);
  wave.stateCallback_.invoke(wave.state_)
};
wave.getViewer = function() {
  return wave.viewer_
};
wave.getHost = function() {
  return wave.host_
};
wave.getParticipants = function() {
  return wave.participants_
};
wave.getParticipantById = function(a) {
  return wave.participantMap_[a]
};
wave.getState = function() {
  return wave.state_
};
wave.getMode = function() {
  if(wave.state_) {
    var a = wave.state_.get("${playback}"), b = wave.state_.get("${edit}");
    if(a != null && b != null)return a == "1" ? wave.Mode.PLAYBACK : b == "1" ? wave.Mode.EDIT : wave.Mode.VIEW
  }return wave.Mode.UNKNOWN
};
wave.isPlayback = function() {
  return!(wave.state_ && wave.state_.get("${playback}", "1") == "0")
};
wave.setStateCallback = function(a, b) {
  wave.stateCallback_ = new wave.Callback(a, b);
  wave.state_ && wave.stateCallback_.invoke(wave.state_)
};
wave.setParticipantCallback = function(a, b) {
  wave.participantCallback_ = new wave.Callback(a, b);
  wave.participants_ && wave.participantCallback_.invoke(wave.participants_)
};
wave.setModeCallback = function() {
};
wave.getTime = function() {
  return(new Date).getTime()
};
wave.log = function(a) {
  gadgets.rpc.call(null, "wave_log", null, a || "")
};
wave.internalInit_ = function() {
  wave.checkWaveContainer_();
  if(wave.isInWaveContainer()) {
    gadgets.rpc.register("wave_participants", wave.receiveWaveParticipants_);
    gadgets.rpc.register("wave_gadget_state", wave.receiveState_);
    gadgets.rpc.call(null, "wave_enable", null, "0.1")
  }
};

// $avital
wave.internalInit_()
/*
f = function() {
  document.addEvent('domready', function() {
    wave.internalInit_()
  })
}()*/

window.top.wave = wave

