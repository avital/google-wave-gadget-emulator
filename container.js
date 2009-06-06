loadGadget = function() {
  var participantId = $random(0, 999999999)
  var gadgetHtmlPath = 'gadgets/?' + gadgetURL;
  var iframe = this
  
  new Request({
    url: gadgetHtmlPath, 
    method: 'get', 
    onSuccess: function(text) {
      var frame = new IFrame({
        id: 'gadget',
        src: gadgetHtmlPath,
        frameborder: 0,
        style: 'display: block; overflow: hidden;',
        width: '100%',
        height: '500px'
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
    document.title = mainTitle
    docId = null
    $('new').setStyle('display', 'block')
    $('gadget').empty()
    return
  }
  else if (hashCode.length == 1) {
    gadgetURL = window.location.hash.substring(1)
    document.title = mainTitle + ' - Create new gadget from URL ' + gadgetURL
    docId = $random(100000000, 999999999)
    window.location.hash = gadgetURL + '#' + docId
    return
  }
  else {
    gadgetURL = hashCode[0]
    docId = hashCode[1]
    document.title = mainTitle + ' - ' + gadgetURL + ' [' + docId + ']'
  }
  
  $('new').setStyle('display', 'none')
  loadGadget();
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

  checkHash.periodical(500)
})
