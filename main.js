window.onload = function () {
	// ============= Generate quiz-game
	fetch('./quizes.json')
		.then(res => res.json())
		.then(res => {
			whenGenerateQuiz(res)
		})

	function whenGenerateQuiz(game) {
		// Time generating
		let timer;
		document.querySelector('.minute-q').innerHTML = game.time.minute
		if (game.time.second < 10) game.time.second = '0' + game.time.second
		document.querySelector('.second-q').innerHTML = game.time.second
		// current question generation
		document.querySelector('.current-q').innerHTML = 1
		document.querySelector('.all-q').innerHTML = game.questions.length

		// ============== Home page button
		document.querySelector(".start-btn").addEventListener('click', () => {
			document.querySelector('.home-page').style.display = 'none'
			document.querySelector('.quiz-board').style.display = 'block'
			document.querySelector('.finish').style.display = 'none'


			// ===================== Run Timer
			let gameTime = {
				m: game.time.minute,
				s: game.time.second
			}
			timer = setInterval(() => {
				if (gameTime.s > 0) gameTime.s--
				else if (gameTime.m > 0) {
					gameTime.m--
					gameTime.s = 59
				}
				else {
					clearInterval(timer)
					finishBoard()
					return false
				}
				changeTimer()
			}, 1000)

			function changeTimer() {
				document.querySelector('.minute-q').innerHTML = gameTime.m
				if (gameTime.s < 10) gameTime.s = '0' + gameTime.s
				document.querySelector('.second-q').innerHTML = gameTime.s
			}
		})

		// ==== Create quiz button
		let quiz = {}
		let questionsCount = 0

		document.querySelector('.create-btn').addEventListener('click', () => {
			document.querySelector('.home-page').style.display = 'none'
			document.querySelector('.check-board').style.display = 'none'
			document.querySelector('.create-board').style.display = 'block'

			questionsCount = 0
			quiz = {
				"time": {
					"minute": 2,
					"second": 0
				},
				"about": "Javascript basic",
				"questions": [

				]
			}
		})

		// ==== Add question
		document.querySelector('.add-q').addEventListener('click', () => {
			questionsCount++
			let q = document.createElement('input')
			q.classList.add('q')
			q.placeholder = 'Enter question'

			// ==== Answers generating
			let a = document.createElement('input')
			a.placeholder = 'Option A'
			a.classList.add('answer')
			let b = document.createElement('input')
			b.placeholder = 'Option B'
			b.classList.add('answer')
			let c = document.createElement('input')
			c.placeholder = 'Option C'
			c.classList.add('answer')
			let d = document.createElement('input')
			d.placeholder = 'Option D'
			d.classList.add('answer')

			let textSelect = document.createElement('span')
			textSelect.innerHTML = 'Correct answer: '
			let select = document.createElement('select')
			let letters = 'abcd'
			for (let i = 0; i < 4; i++) {
				let opt = document.createElement('option')
				opt.value = letters[i]
				opt.innerHTML = letters[i]
				select.appendChild(opt)
			}

			let count = document.createElement('p')
			count.classList.add('title')
			count.style.marginBottom = 0
			count.innerHTML = 'Question - ' + questionsCount + ')'

			document.querySelector('.create-board').appendChild(document.createElement('br'))
			document.querySelector('.create-board').appendChild(count)
			document.querySelector('.create-board').appendChild(q)
			document.querySelector('.create-board').appendChild(a)
			document.querySelector('.create-board').appendChild(b)
			document.querySelector('.create-board').appendChild(c)
			document.querySelector('.create-board').appendChild(d)
			document.querySelector('.create-board').appendChild(document.createElement('br'))
			document.querySelector('.create-board').appendChild(textSelect)
			document.querySelector('.create-board').appendChild(select)
			document.querySelector('.create-board').appendChild(document.createElement('br'))
			document.querySelector('.create-board').appendChild(document.createElement('br'))
			document.querySelector('.create-board').appendChild(document.querySelector('.add-q'))
		})

		// ============ Question and Variants
		let questionNumber = 1
		let resultObj = {}
		setQuestion()

		// =========================== Change question function
		function setQuestion() {
			document.querySelector('.question').innerHTML = questionNumber + ') ' + game.questions[questionNumber - 1].q
			let letters = 'abcd'
			let options = document.querySelectorAll('.variant')

			if (resultObj[questionNumber]) {
				for (let opt of options) {
					opt.classList.remove('active')
					if (opt.getAttribute('data-value') === resultObj[questionNumber]) {
						opt.classList.add('active')
					}
				}
			} else {
				for (let opt of options) opt.classList.remove('active')
			}

			for (let i = 0; i < options.length; i++) {
				options[i].innerHTML = (letters[i]) + ') ' + game.questions[questionNumber - 1][letters[i]]
				options[i].addEventListener('click', () => {
					resultObj[questionNumber] = options[i].getAttribute('data-value')
					for (let opt of options) {
						opt.classList.remove('active')
					}
					options[i].classList.add('active')
				})
			}

			if (questionNumber === 1) document.querySelector('.quiz-next-btn.prev').style.visibility = 'hidden'
			else document.querySelector('.quiz-next-btn.prev').style.visibility = 'visible'

			if (questionNumber === game.questions.length) {
				document.querySelector('.quiz-next-btn.finish').style.display = 'block'
				document.querySelector('.quiz-next-btn.next').style.display = 'none'
			}
			else {
				document.querySelector('.quiz-next-btn.finish').style.display = 'none'
				document.querySelector('.quiz-next-btn.next').style.display = 'block'
			}
			document.querySelector('.current-q').innerHTML = questionNumber
		}

		// ========== Next button
		document.querySelector('.quiz-next-btn.next').addEventListener('click', () => {
			if (questionNumber < game.questions.length) {
				questionNumber++
				setQuestion()
			}
		})
		document.querySelector('.quiz-next-btn.prev').addEventListener('click', () => {
			if (questionNumber > 1) {
				questionNumber--
				setQuestion()
			}
		})
		document.querySelector('.quiz-next-btn.finish').addEventListener('click', () => {
			if (Object.keys(resultObj).length === game.questions.length) {
				finishBoard()
			}
		})
		function finishBoard() {
			document.querySelector('.quiz-board').style.display = 'none'
			document.querySelector('.check-board').style.display = 'block'
			clearInterval(timer)
			let trueAnswers = 0
			let resultInfo = document.querySelector('.result-info')
			for (let i = 0; i < game.questions.length; i++) {
				questions = game.questions[i]
				// ==== Question generating
				let q = document.createElement('p')
				q.classList.add('q')
				q.innerHTML = (i + 1) + ') ' + questions.q

				// ==== Answers generating
				let a = document.createElement('p')
				a.innerHTML = questions.a
				a.classList.add('answer')
				let b = document.createElement('p')
				b.innerHTML = questions.b
				b.classList.add('answer')
				let c = document.createElement('p')
				c.innerHTML = questions.c
				c.classList.add('answer')
				let d = document.createElement('p')
				d.innerHTML = questions.d
				d.classList.add('answer')

				switch (resultObj[i + 1]) {
					case 'a': if (questions.correct === 'a') {
						a.classList.add('true')
						trueAnswers++
					} else {
						a.classList.add('false')
						showTrueAnswer(questions.correct)
					} break;
					case 'b': if (questions.correct === 'b') {
						b.classList.add('true')
						trueAnswers++
					} else {
						b.classList.add('false')
						showTrueAnswer(questions.correct)
					} break;
					case 'c': if (questions.correct === 'c') {
						c.classList.add('true')
						trueAnswers++
					} else {
						c.classList.add('false')
						showTrueAnswer(questions.correct)
					} break;
					case 'd': if (questions.correct === 'd') {
						d.classList.add('true')
						trueAnswers++
					} else {
						d.classList.add('false')
						showTrueAnswer(questions.correct)
					} break;
				}
				if (!resultObj[i + 1]) showTrueAnswer(questions.correct, 'false')

				function showTrueAnswer(trueAnswer, paste = 'true') {
					if (trueAnswer === 'a') a.classList.add(paste)
					else if (trueAnswer === 'b') b.classList.add(paste)
					else if (trueAnswer === 'c') c.classList.add(paste)
					else d.classList.add(paste)
				}

				resultInfo.innerHTML = `${trueAnswers}/${game.questions.length} - ${Math.floor((trueAnswers / game.questions.length) * 100)}%`

				document.querySelector('.check-board').appendChild(q)
				document.querySelector('.check-board').appendChild(document.createElement('hr'))
				document.querySelector('.check-board').appendChild(a)
				document.querySelector('.check-board').appendChild(b)
				document.querySelector('.check-board').appendChild(c)
				document.querySelector('.check-board').appendChild(d)
				document.querySelector('.check-board').appendChild(document.createElement('br'))
			}
		}
	}
}