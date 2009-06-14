loaded = false

loadGadget = function(gadgetURL, callback) {
  console.log('loadGadget')
  
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

realHash = function() {
  return window.location.hash.substring(1)
}

load = function() {
  console.log('load()')
  
  if (realHash().contains('#')) {
    // old emulator hash scheme
    window.location.replace('#' + realHash().replace('#', '!'))
    return
  }
  else {
    var hashCode = realHash().split('!');

    console.log(hashCode)

    if (hashCode == '') {
      if (loaded)
        window.location.reload()
    }
    else if (hashCode.length == 1) {
      var gadgetURL = realHash()
      var docId = $random(100000000, 999999999)
      document.title = 'Create new gadget from URL ' + gadgetURL
      window.location.replace(window.location.href + '!' + docId)
    }
    else {
      var gadgetURL = hashCode[0]
      var docId = hashCode[1]
      document.title = gadgetURL + ' [' + docId + ']'
      emulator.docURL = '/emulator/db/' + docId
  
      $('source').set('href', gadgetURL)
      $('instance').set('href', '#' + gadgetURL)
  
      $('new').setStyle('display', 'none')
      loadGadget(gadgetURL, emulator.checkState)
    }
  }
}

lastHashCode = null

checkHash = function() {
  if (lastHashCode != realHash()) {
    lastHashCode = realHash()
    load() 
  }
}

document.addEvent('domready', function() {
  mainTitle = document.title

  $('create').addEvent('click', function() {
    window.location.hash = $('gadget_url').get('value') + '%' + $random(100000000, 999999999)
  })

  $('change').addEvent('click', function() {
    participantId = $random(100000000, 999999999)
    participantName = prompt('Enter name')
    Cookie.write('wave-name', participantName)    
    addMe()
  })

  checkHash.periodical(500)
})
