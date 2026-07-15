const loadFormButton = () => {
	const btnFormSubmit_Contenaire = document.getElementById('publishChangeButton-contenaire')
	if(document.querySelector('form')) {
		btnFormSubmit_Contenaire.style.display = 'block'
		const btnFormSubmit = document.getElementById('publishChangeButton')
		if(document.querySelector('form').dataset.submit) btnFormSubmit.querySelector('span.text').textContent = document.querySelector('form').dataset.submit
		btnFormSubmit.addEventListener('click', () => {
			document.querySelector('form').submit()
			console.log('load')
		})
	} else { btnFormSubmit_Contenaire.style.display = 'none' }
}

Omsy.event.event.load['welcome'] = () => {
	loadFormButton()
}

class OmsyProgress {
	progressErr = 0
	progress = null
	max = 0
	loading_ = false
	endeding = false

	constructor(element, max) {
		this.progress = element
		this.max = max

		this.init()
	}
	update(current, label) {
		if(this.endeding) return;
		if(this.loading_) this.progress.querySelector('.progress-content').parentNode.classList.remove('load')

		const pct = this.max > 0 ? Math.round((current / this.max) * 100) : 0;
		this.progress.querySelector('.progress-content').style.width = pct + '%';

		this.progress.querySelector('span.name').textContent = label;
		if(current === this.max) {
			this.ended()
			return
		} else this.progress.querySelector('span.status-completed').textContent = pct + '% Completed';
		this.progress.querySelector('span.status').textContent = current + ' sur ' + this.max;
	}

	loading(label) {
		this.loading_ = true
		this.progress.querySelector('span.name').textContent = label;
		this.progress.querySelector('span.status-completed').textContent = 'Chargement';
		this.progress.querySelector('span.status').textContent = '';

		this.progress.querySelector('.progress-content').style.width = '100%';
		this.progress.querySelector('.progress-content').parentNode.classList.add('load')
	}

	/*
	 * 
	 */
	init() {
		this.progress.classList.add('kit-progress', 'content')
		let html = `<div class="progress-contenaire"><div class="head"><div class="left"><span class="name"></span></div><div class="right"><span class="status-completed">Attente de démarrage</span><span class="status">0 / ${this.max}</span></div></div><div class="content"><div class="progress"><div class="progress-content"></div></div></div></div><div class="message-contenaire"></div>`
		this.progress.innerHTML = html
	}

	err(message = 'Une erreur est survenues') {
		this.progressErr++
		let html = `<div class="message-box error"><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M502.92-300.15q9.39-9.39 9.39-22.93T502.92-346q-9.38-9.38-22.92-9.38-13.54 0-22.92 9.38-9.39 9.38-9.39 22.92 0 13.54 9.39 22.93 9.38 9.38 22.92 9.38 13.54 0 22.92-9.38ZM450-436.92h60v-240h-60v240ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span><p>${message}</p></div>`
		this.progress.querySelector('.message-contenaire').insertAdjacentHTML('afterbegin', html)
	}

	message(message = 'Une erreur est survenues') {
		let html = `<div class="message-box message"><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z"/></svg></span><p>${message}</p></div>`
		this.progress.querySelector('.message-contenaire').insertAdjacentHTML('afterbegin', html)
	}

	ended() {
		this.endeding = true
		this.progress.querySelector('.progress-contenaire').remove()

		let html = ''
		if(this.progressErr == 0) html = `<div class="message-box success"><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m423.23-309.85 268.92-268.92L650-620.92 423.23-394.15l-114-114L267.08-466l156.15 156.15ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span><p>Tout ces terminée avec succées</p></div>`
		else html = `<div class="message-box success"><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M74.62-140 480-840l405.38 700H74.62ZM178-200h604L480-720 178-200Zm324.92-57.08q9.39-9.38 9.39-22.92 0-13.54-9.39-22.92-9.38-9.39-22.92-9.39-13.54 0-22.92 9.39-9.39 9.38-9.39 22.92 0 13.54 9.39 22.92 9.38 9.39 22.92 9.39 13.54 0 22.92-9.39ZM450-352.31h60v-200h-60v200ZM480-460Z"/></svg></span><p>Tout ces terminée avec ${this.progressErr} erreur(s)</p></div>`
		this.progress.querySelector('.message-contenaire').insertAdjacentHTML('afterbegin', html)
	}
}