class OmsyInterval {
	intervalArrayCurrent = {}
	intervalRequestArrayCurrent = {}

	intervalTime = (1000 * 20) // 1s * int
	maxIntervalTime = ( (1000 * 3600) * 0.02) // 1heures * int
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
				
				this.self.event.updatebar(`loadInterval`, i, max)
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
	getSession(callback) {
		//this.self.interval.setRequestInterval('/api/omsyPanel/test', 'texte', (res) => { console.log('Texte') })
		//this.self.interval.setRequestInterval('/api/omsyPanel/test', 'teste', (res) => { console.log('Teste') })
		this.self.interval.setRequestInterval('/api/session', 'session', (res) => {
			document.getElementById('get-session').textContent = res.total_session+' omsy.online'

			if(!document.getElementById('total-session')) return;

			// Counting
			document.getElementById('total-session').textContent = res.total_session
			document.getElementById('get-count-accounts').textContent = res.total_accounts
			document.getElementById('get-count-accounts-data').textContent = res.total_accounts_data
			document.getElementById('get-size-disk').textContent = (res.size.disk_size / 1024 / 1024).toFixed(2)+' Mo'

			// DataList
			document.getElementById('first-watch-page').innerHTML = ''
			document.getElementById('best-watch-page').innerHTML = ''

			document.getElementById('list-signup').innerHTML = ''
			document.getElementById('list-last-signin').innerHTML = ''

			res.list.forEach((e) => {
				document.getElementById('first-watch-page').insertAdjacentHTML('afterbegin',`<li class="list-stat-flex-space">
					<span>${e.page}</span>
					<span>${e.appareil}</span>
				</li>`)
			})

			for (const [key, value] of Object.entries(res.best_pages)) {
				document.getElementById('best-watch-page').insertAdjacentHTML('beforeend',`<li class="list-stat-flex-space">
					<span>${key}</span>
					<span>${value}</span>
				</li>`)
			}

			res.accounts.forEach((e) => {
				document.getElementById('list-signup').insertAdjacentHTML('afterbegin',`<li class="list-stat-flex-space">
					<span>${e.username}</span>
					<span>${e.register_date}</span>
				</li>`)
			})

			res.accountsLastSignIn.forEach((e) => {
				document.getElementById('list-last-signin').insertAdjacentHTML('afterbegin',`<li class="list-stat-flex-space">
					<span>${e.username}</span>
					<span>${e.register_date}</span>
				</li>`)
			})
		})
	}
}
class OmsyEvent {
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
				let countBuff = 0;
				//let countBufTf = 0;
				window.addEventListener(key, (event) => {
					for(const [keys, values] of Object.entries(value)) {
						console.log(keys)
						this.event[key][keys](event)
						this.updatebar(`loadEvent`, countBuff, Object.values(value).length)
						countBuff++
					}
				})
			}
		}
	}
	updatebar(name, countBuff, buffLength) {
		const listProgressbar = document.querySelector('#list-progressbar')
		if(!listProgressbar.querySelector(`.progress-id-${name}`)) {
			listProgressbar.insertAdjacentHTML('afterbegin', `<li>
				<div class="kit-progressbar progress-id-${name}">
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-509.23q70.62 0 119.15-50.08 48.54-50.07 48.54-120.69v-120H312.31v120q0 70.62 48.54 120.69 48.53 50.08 119.15 50.08ZM200-120v-40h72.31v-120q0-74.08 45.42-131.42 45.42-57.35 116.42-68.58-71-12-116.42-68.96-45.42-56.96-45.42-131.04v-120H200v-40h560v40h-72.31v120q0 74.08-45.42 131.04Q596.85-492 525.85-480q71 11.23 116.42 68.58 45.42 57.34 45.42 131.42v120H760v40H200Z"/></svg>
					</span>
					<span class="icon">
						<span class="progress"><span class="progress-content"></span></span>
					</span>
					<span class="text progress-message">Démarrage...</span>
				</div>
			</li>`)
		}

		let pourc = (((countBuff+1) / (buffLength)) * 100)
		//if((((countBuff+1) / buffLength) * 100) >= 100) {
		//	pourc = (((countBuff+1) / (buffLength)) * 100)
		//}

		listProgressbar.querySelector(`.progress-id-${name}`).querySelector('.progress-message').textContent = name+' '+(countBuff+1)+'/'+buffLength
		listProgressbar.querySelector(`.progress-id-${name}`).querySelector('.progress-content').style.width = pourc+'%'

		if((((countBuff+1) / buffLength) * 100) >= 100) {
			setTimeout(() => {
				listProgressbar.querySelector(`.progress-id-${name}`).parentNode.remove()
			}, 5000)
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
	constructor(self) {
		this.self = self;

		this.textCountSpeedUp = document.getElementById('get-speedup-count')
		this.textCountSpeedDown = document.getElementById('get-speeddown-count')
		this.iconOnline = document.getElementById('icon-watchline')

		this.self.event.event.load['OmsyNetwork'] = () => {
			if (navigator.onLine && this.iconOnline) {
				if(this.iconOnline) this.iconOnline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M140-100v-240h120v-160h200v-120H340v-240h280v240H500v120h200v160h120v240H540v-240h120v-120H300v120h120v240H140Zm240-560h200v-160H380v160ZM180-140h200v-160H180v160Zm400 0h200v-160H580v160ZM480-660ZM380-300Zm200 0Z"/></svg>'
			} else {
				if(this.iconOnline) this.iconOnline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m663.23-409.77-26.69-26.69q20.46-26.77 31.96-58.16Q680-526 680-560q0-40-14.85-76.77-14.84-36.77-43.61-64.77L648-728q33.38 34.15 51.31 77.54 17.92 43.38 17.92 91.23 0 41.08-13.54 79.58t-40.46 69.88ZM548.08-524.92 444.92-628.08q8.16-4.69 16.93-6.77 8.77-2.07 18.15-2.07 32 0 54.46 22.46T556.92-560q0 9.38-2.07 18.15-2.08 8.77-6.77 16.93Zm208.84 208.61-26.46-26.46q39.23-45 60.39-101.11Q812-500 812-560q0-66-25.27-126.73-25.27-60.73-72.27-107.73l26.46-26.46q51.93 52.61 80.12 119.84 28.19 67.23 28.19 141.08 0 67.85-23.19 130.96-23.19 63.12-69.12 112.73Zm36.39 206.46L500-403.15v247.77h-40v-287.77L289.23-613.69q-4.61 13.54-6.92 26.84Q280-573.54 280-560q0 40 14.85 76.77 14.84 36.77 43.61 64.77L312-392q-33.38-33.38-51.31-76.77-17.92-43.38-17.92-91.23 0-21.62 3.54-42.62 3.54-21 13.15-41.07l-71-71q-20.23 35.92-30.34 74.54Q148-601.54 148-560q0 66 25.27 126.73 25.27 60.73 72.27 107.73l-26.46 26.46q-51.93-52.61-80.12-119.84-28.19-67.23-28.19-141.08 0-48.62 12.19-94.96 12.19-46.35 37.35-87.89l-50.46-50.46 28.3-28.54 683.7 683.7-28.54 28.3Z"/></svg>'
			}

			if(this.textCountSpeedDown) this.downloadSpeed()
			if(this.textCountSpeedUp) this.uploadSpeed()
		}

		window.addEventListener('offline',  () => {
			if(this.iconOnline) this.iconOnline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m663.23-409.77-26.69-26.69q20.46-26.77 31.96-58.16Q680-526 680-560q0-40-14.85-76.77-14.84-36.77-43.61-64.77L648-728q33.38 34.15 51.31 77.54 17.92 43.38 17.92 91.23 0 41.08-13.54 79.58t-40.46 69.88ZM548.08-524.92 444.92-628.08q8.16-4.69 16.93-6.77 8.77-2.07 18.15-2.07 32 0 54.46 22.46T556.92-560q0 9.38-2.07 18.15-2.08 8.77-6.77 16.93Zm208.84 208.61-26.46-26.46q39.23-45 60.39-101.11Q812-500 812-560q0-66-25.27-126.73-25.27-60.73-72.27-107.73l26.46-26.46q51.93 52.61 80.12 119.84 28.19 67.23 28.19 141.08 0 67.85-23.19 130.96-23.19 63.12-69.12 112.73Zm36.39 206.46L500-403.15v247.77h-40v-287.77L289.23-613.69q-4.61 13.54-6.92 26.84Q280-573.54 280-560q0 40 14.85 76.77 14.84 36.77 43.61 64.77L312-392q-33.38-33.38-51.31-76.77-17.92-43.38-17.92-91.23 0-21.62 3.54-42.62 3.54-21 13.15-41.07l-71-71q-20.23 35.92-30.34 74.54Q148-601.54 148-560q0 66 25.27 126.73 25.27 60.73 72.27 107.73l-26.46 26.46q-51.93-52.61-80.12-119.84-28.19-67.23-28.19-141.08 0-48.62 12.19-94.96 12.19-46.35 37.35-87.89l-50.46-50.46 28.3-28.54 683.7 683.7-28.54 28.3Z"/></svg>'
		});

		window.addEventListener('online', () => {
			if(this.iconOnline) this.iconOnline.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M140-100v-240h120v-160h200v-120H340v-240h280v240H500v120h200v160h120v240H540v-240h120v-120H300v120h120v240H140Zm240-560h200v-160H380v160ZM180-140h200v-160H180v160Zm400 0h200v-160H580v160ZM480-660ZM380-300Zm200 0Z"/></svg>'
		});
	}
	conversSpeed(startTime, endTime, fileSizeInBits) {
		const duration = (endTime - startTime) / 1000;
		const speedBps = fileSizeInBits / duration;
		const speedMbps = speedBps / (1024 * 1024);

		return speedMbps
	}

	async downloadSpeed() {
		const imageUrl = "api/download"; // nouveau lien
		const startTime = performance.now();

		const response = await fetch(imageUrl, { cache: "no-store" });
		const blob = await response.blob();

		const fileSizeInBits = blob.size * 8;
		const speedMbps = this.conversSpeed(startTime, performance.now(), fileSizeInBits) //speedBps / (1024 * 1024);

		if(this.textCountSpeedDown) this.textCountSpeedDown.textContent = `${speedMbps.toFixed(2)} Mbp/s`
		
		setTimeout(() => this.downloadSpeed(), 2000)
	}
	async uploadSpeed() {
		const data = new Uint8Array(5 * 1024 * 1024); // 5 Mo de données aléatoires
		const startTime = performance.now();

		await fetch("api/upload", {
			method: "POST",
			body: data
		});

		const fileSizeInBits = data.length * 8;
		const speedMbps = this.conversSpeed(startTime, performance.now(), fileSizeInBits)

		if(this.textCountSpeedUp) this.textCountSpeedUp.textContent = `${speedMbps.toFixed(2)} Mbp/s`
		setTimeout(() => this.uploadSpeed(), 2000)
	}
}

const Omsy = new class OmsyDefaultClass {
	constructor() {
		const self = this;

		this.consoleError = console.error;
		this.consoleWarn = console.warn;
		this.consoleLog = console.log;

		this.consoleLog_ = [];

		this.textCountErr
		this.textCountWarn
		this.textCountLog

		this.errorCount = 0
		this.warningCount = 0
		this.logingCount = 0

		console.error = function (...args) {
			self.errorCount++;
			if(self.textCountErr) self.textCountErr.textContent = self.errorCount
			self.consoleError.apply(console, args);
			args.forEach((e) => {
				if(e.toString().includes('<li', '</li>')) self.consoleLog_.push(`${e}`)
				if(!e.toString().includes('<li', '</li>')) self.consoleLog_.push(`<li style="color: var(--color-red)">${e}</li>`)

				if(self.listLogs && e.toString().includes('<li', '</li>')) self.listLogs.insertAdjacentHTML('afterbegin', `${e}`)
				if(self.listLogs && !e.toString().includes('<li', '</li>')) self.listLogs.insertAdjacentHTML('afterbegin', `<li style="color: var(--color-red)">${e}</li>`)
			})
		};
		console.warn = function (...args) {
			self.warningCount++;
			if(self.textCountWarn) self.textCountWarn.textContent = self.warningCount
			args.forEach((e) => {
				if(e.toString().includes('<li', '</li>')) self.consoleLog_.push(`${e}`)
				if(!e.toString().includes('<li', '</li>')) self.consoleLog_.push(`<li style="color: var(--color-orange)">${e}</li>`)

				if(self.listLogs && e.toString().includes('<li', '</li>')) self.listLogs.insertAdjacentHTML('afterbegin', `${e}`)
				if(self.listLogs && !e.toString().includes('<li', '</li>')) self.listLogs.insertAdjacentHTML('afterbegin', `<li style="color: var(--color-orange)">${e}</li>`)
			})
			if(document.getElementById('get-logs-count')) document.getElementById('get-logs-count').textContent = `(${self.consoleLog_.length}) Logs`
			self.consoleWarn.apply(console, args);
		};
		console.log = function (...args) {
			self.logingCount++;
			if(self.textCountLog) self.textCountLog.textContent = self.logingCount
			args.forEach((e) => {
				//self.consoleLog.apply(console, [e]);
				if(e.toString().includes('<li', '</li>')) self.consoleLog_.push(`${e}`)
				if(!e.toString().includes('<li', '</li>')) self.consoleLog_.push(`<li>${e}</li>`)

				if(self.listLogs && e.toString().includes('<li', '</li>')) self.listLogs.insertAdjacentHTML('afterbegin', `${e}`)
				if(self.listLogs && !e.toString().includes('<li', '</li>')) self.listLogs.insertAdjacentHTML('afterbegin', `<li>${e}</li>`)
			})
			if(document.getElementById('get-logs-count')) document.getElementById('get-logs-count').textContent = `(${self.consoleLog_.length}) Logs`
			self.consoleLog.apply(console, args);
		};

		window.onerror = function (message, source, lineno, colno, error) {
			self.errorCount++;
			if(self.textCountErr) self.textCountErr.textContent = self.errorCount;
			self.consoleLog_.push(`<li style="color: var(--color-red)">${lineno} ${message}</li>`)
			if(self.listLogs) self.listLogs.insertAdjacentHTML('afterbegin', `<li style="color: var(--color-red)">${lineno} ${message}</li>`)
			if(document.getElementById('get-logs-count')) document.getElementById('get-logs-count').textContent = `(${self.consoleLog_.length}) Logs`
		};

		this.event = new OmsyEvent(this);

		this.event.event.load['GoodMorningOmsy'] = () => {
			this.consoleLog('heello')

			this.progress = document.querySelector('.progress-id-izebvezbn')
			this.textCountErr = document.getElementById('get-err-count')
			this.textCountWarn = document.getElementById('get-warn-count')
			this.textCountLog = document.getElementById('get-log-count')

			this.listLogs = document.getElementById('get-logs')

			if(this.textCountErr) this.textCountErr.textContent = this.errorCount
			if(this.textCountWarn) this.textCountWarn.textContent = this.warningCount
			if(this.textCountLog) this.textCountLog.textContent = this.logingCount

			//console.log(this.consoleLog_)
			this.consoleLog_.forEach((e) => {
				document.getElementById('get-logs-count').textContent = `(${this.consoleLog_.length}) Logs`
				if(this.listLogs && e.includes('<li', '</li>')) this.listLogs.insertAdjacentHTML('afterbegin', `${e}`)
				if(this.listLogs && !e.includes('<li', '</li>')) this.listLogs.insertAdjacentHTML('afterbegin', `<li>${e}</li>`)
			})

			this.interval.loadInterval()
		}

		this.network = new OmsyNetwork(this);
		this.panel = new OmsyPanel(this);
		this.interval = new OmsyInterval(this);
		this.event.loadEvent()
	}
}