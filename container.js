loaded = false

loadGadget = function(callback) {
  var gadgetHtmlPath = 'gadgets/?' + gadgetURL;
  var iframe = this
  loaded = true
  
  new Request({
    url: gadgetHtmlPath, 
    method: 'get', 
    onSuccess: function(text) {
      $('gadgetarea').setStyle('display', 'block')
      var frame = new IFrame({
        id: 'gadgetframe',
        src: gadgetHtmlPath,
        frameborder: 0,
        style: 'display: block; overflow: hidden;',
        width: '100%',
        height: '500px',
        events: {
          load: callback
        }
      }).inject($('gadget'))
    },
    onFailure: function() { 
      alert("Load failed"); 
    }
  }).send()
}

load = function() {
  var hashCode = window.location.hash.substring(1).split('#');

  if (hashCode == '') {
    if (loaded)
      window.location.reload()

    return
  }
  else if (hashCode.length == 1) {
    gadgetURL = window.location.hash.substring(1)
    document.title = 'Create new gadget from URL ' + gadgetURL
    docId = $random(100000000, 999999999)
    window.location.hash = gadgetURL + '#' + docId
    return
  }
  else {
    gadgetURL = hashCode[0]
    docId = hashCode[1]
    document.title = gadgetURL + ' [' + docId + ']'
  }
  
  $('source').set('href', gadgetURL)
  
  $('new').setStyle('display', 'none')
  loadGadget(checkState)
}

lastHashCode = null

checkHash = function() {
  var hashCode = window.location.hash.substring(1)
  if (lastHashCode != hashCode) {
    load() 
    lastHashCode = hashCode
  }
}

document.addEvent('domready', function() {
  mainTitle = document.title

  $('create').addEvent('click', function() {
    window.location.hash = $('gadget_url').get('value') + '#' + $random(100000000, 999999999)
  })

  $('change').addEvent('click', function() {
    participantId = $random(100000000, 999999999)
    participantName = prompt('Enter name')
    Cookie.write('wave-name', participantName)    
    addMe()
  })

  checkHash.periodical(500)
})
