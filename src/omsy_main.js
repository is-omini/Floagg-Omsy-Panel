const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OmsyInterval {
  intervalArrayCurrent = {}
  intervalRequestArrayCurrent = {}

  intervalTime = (1000 * 20) // 1s * int
  maxIntervalTime = ( (1000 * 3600) * 2) // 1heures * int
  currentIntervalTime = 0

  interval = null

  constructor(self) {
    this.self = self

    console.warn(`OmsyInterval maxIntervalTime = ${this.maxIntervalTime}, intervalTime = ${this.intervalTime} / intervalmaxRefresh = ${Math.round(this.maxIntervalTime / this.intervalTime)}`)
  }

  setRequestInterval(url, name, callback, object = {}) {
    this.intervalRequestArrayCurrent[name] = {
      url: url,
      function: callback,
      object: object
    }
  }

  loadFunction() {
    Object.keys(this.intervalArrayCurrent).forEach((name) => {
      this.intervalArrayCurrent[name].function()
    })
  }

  loadInterval() {
    /* Object.keys(this.intervalArrayCurrent).forEach((name) => {
      this.intervalArrayCurrent[name].function()
    }) */
    let i = 0
    const max = Object.keys(this.intervalRequestArrayCurrent).length
    if(max > 0) document.querySelector('body').classList.add('load-fetch')
    Object.keys(this.intervalRequestArrayCurrent).forEach((name) => {
      //setTimeout(() => {
      request(
        this.intervalRequestArrayCurrent[name].url,
        this.intervalRequestArrayCurrent[name].object,
        true
      )
      .then((res) => {
        if(document.getElementById('lastRequestAction'))
          document.getElementById('lastRequestAction').textContent = 'Requested : '+this.intervalRequestArrayCurrent[name].url
        
        i++

        if(max == i) {
          document.querySelector('body').classList.remove('load-fetch')
          if(this.currentIntervalTime <= this.maxIntervalTime) {
            this.interval = setTimeout(() => {
              this.loadInterval()
            }, this.intervalTime)
          } else {
            console.warn(`OmsyInterval Stopped for maxIntervalTime = ${this.maxIntervalTime}`)
          }
          this.currentIntervalTime+=this.intervalTime
        }

        this.intervalRequestArrayCurrent[name].function(res)
      })
      //}, 10000)
      
    })
  }

  reloadInterval() {
    Object.keys(this.intervalArrayCurrent).forEach((name) => {
      console.log(`Reloading interval: ${name}`)
      // Example logic: this.intervalArrayCurrent[name].function()
    })
  }

  setInterval(name, callback,windowLoad = false) {
    this.intervalArrayCurrent[name] = {
      function: callback,
      isLoad: windowLoad
    }
  }

  removeInterval(name) {
    delete this.intervalArrayCurrent[name]
  }
}

class OmsyPanel {
  constructor(self) { this.self = self }
  hide(_this) { _this.classList.toggle('hidden') }
}
class Omsy_Event {
  constructor(self) { this.self = self }
  inArray(needle, haystack, strict = false) {
    if (!Array.isArray(haystack)) return false;

    for (let i = 0; i < haystack.length; i++) {
      if (strict) {
        if (haystack[i] === needle) return true;
      } else {
        if (haystack[i] == needle) return true;
      }
    }

    return false;
  }
  resetEvent() {
    for(const [key, value] of Object.entries(this.event)) {
      if(this.inArray(key, ['resize', 'scroll'])) {
        window.removeEventListener(key, (event) => {
          for(const [keys, values] of Object.entries(value)) {
            this.event[key][keys](event)
          }
        })
      }
    }
    for(const [key, value] of Object.entries(this.var)) {
      if(this.inArray(key, ['timeout'])) {
        for(const [keys, values] of Object.entries(value)) {
          clearTimeout(this.var[key][keys]);
        }
      }

      if(this.inArray(key, ['interval'])) {
        for(const [keys, values] of Object.entries(value)) {
          clearInterval(this.var[key][keys]);
        }
      }
    }
  }
  loadEvent() {
    this.resetEvent()
    for(const [key, value] of Object.entries(this.event)) {
      if(this.inArray(key, ['resize', 'load', 'scroll'])) {
        window.addEventListener(key, (event) => {
          for(const [keys, values] of Object.entries(value)) {
            this.event[key][keys](event)
          }
        })
      }
    }


  }

  event = {
    resize: [],
    load: [],
    scroll: []
  }
  var = {
    timeout: [],
    interval: []
  }
  function = {}
}

class OmsyNetwork {
  loader2026(element) {
    const preload = new Image();
    preload.src = element.getAttribute("fetched-src");
    preload.onload = () => {
      element.src = element.getAttribute("fetched-src")
      element.onload = (e) => Observer.observe(element);
    }
    element.onerror = (e) => {}
  }
  constructor(self) {
    this.self = self;
  }
}

const Omsy = new class OmsyDefaultClass {
  copyString(string) {
    navigator.clipboard.writeText(string)
    .then(() => {console.log("Texte copié !");})
    .catch(err => {console.error("Erreur :", err);});
  }
  constructor() {
    const self = this;

    this.event = new Omsy_Event(this);

    this.event.event.load['GoodMorningOmsy'] = () => {
      this.interval.loadInterval()
    }

    this.network = new OmsyNetwork(this);
    this.panel = new OmsyPanel(this);
    this.interval = new OmsyInterval(this);
    this.event.loadEvent()
  }
  href(url) { document.location = url }
  
  request(url, data, json = false) {
    console.log(url, data, json, serverQuery(data))
    let fo = null
    if(data)
      fo = {method: "POST", body: serverQuery(data)}
    
    document.body.classList.add('load-fetch')

    const f = fetch(url, fo)
    .then((res) => {
      if(json) return res.json()
      else return res.text()
    })
    .then((res) => {
      setTimeout(() => {
      document.body.classList.remove('load-fetch')
      }, 1000)
      return res
    })
    //.catch((error) => {
    //  console.error(error)
    //})
    return f

    function serverQuery(obj, form = new FormData(), parentKey = '') {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value instanceof File) {
          // ✅ File traité en premier, avant le check typeof object
          form.append(fullKey, value);
        } else if (value !== null && typeof value === 'object') {
          serverQuery(value, form, fullKey);
        } else {
          form.append(fullKey, value ?? '');
        }
      });

      return form;
    }
  }

  setCookieAndRemoveBlock(self, nameCook, contentCook) {
    this.setCookie(nameCook, contentCook)
    self.remove()
  }

  deleteCookie(name) {
    this.setCookie(name, "", {
      'max-age': -1
    })
  }

  setCookie(name, value, options = {}) {
    options = {
      path: '/',
      // Ajoute d'autres valeurs par défaut si nécessaire
      ...options
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }

  // Retourne le cookie correspondant au nom donné,
  // ou undefined si non trouvé
  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
}

const OmsyEvent = Omsy.event;
const request = Omsy.request;