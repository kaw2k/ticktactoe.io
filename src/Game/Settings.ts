import type { Game } from './Game'
import { PlayerId } from './Players/Player'
import { RandomPlayer } from './Players/RandomPlayer'
import { Token, TokenType } from './Token'

const UPDATE_INTERVAL = 500

export function Tokens(game: Game) {
  const $tokensContainer = document.getElementById('token-container')!
  const $pieceContainer = document.getElementById('piece-container')!
  const $forContainer = document.getElementById('for-container')!

  let tokenType: TokenType = '' as TokenType
  let playerId: PlayerId = '' as PlayerId

  $pieceContainer.onchange = (e: any) => (tokenType = e.target.value)
  $forContainer.onchange = (e: any) => (playerId = e.target.value)

  game.canvas?.element.addEventListener('click', (e) => {
    if (!tokenType || !playerId) return

    const rect = game.canvas?.element.getBoundingClientRect()
    const x = e.clientX - (rect?.left ?? 0)
    const y = e.clientY - (rect?.top ?? 0)

    game.addToken(Token.of(playerId, [x, y], tokenType))
  })

  $pieceContainer.append(
    Radio({
      id: 'rock',
      label: 'Rock',
      value: 'rock',
      name: 'piece',
    }),

    Radio({
      id: 'paper',
      label: 'Paper',
      value: 'paper',
      name: 'piece',
    }),

    Radio({
      id: 'scissors',
      label: 'Scissors',
      value: 'scissors',
      name: 'piece',
    })
  )

  setInterval(() => {
    if (game.players.length === $forContainer.children.length) return

    $forContainer.innerHTML = ''
    $forContainer.append(
      ...game.players.map((player) => {
        return Radio({
          id: player.id,
          label: player.label,
          name: 'for',
          value: player.id,
        })
      })
    )
  }, 500)
}

export function Settings(game: Game) {
  // The root container
  const settingsContainer = document.getElementById('settings-container')!
  const playersContainer = document.getElementById('players-container')!
  const configsContainer = document.getElementById('configs-container')!

  setInterval(() => {
    playersContainer.innerHTML = ''

    playersContainer.append(
      ...game.players.map((player) => {
        const playerContainer = document.createElement('div')
        playerContainer.className = 'player-container'

        const playerName = document.createElement('div')
        playerName.className = 'player-name'
        playerName.innerText = player.label

        const playerScore = document.createElement('div')
        playerScore.className = 'player-score'
        playerScore.innerText = game.tokens
          .filter((token) => token.owner === player.id)
          .length.toString()

        playerContainer.appendChild(playerName)
        playerContainer.appendChild(playerScore)

        return playerContainer
      })
    )
  }, 500)

  configsContainer.appendChild(
    Button({
      text: game.gameActive ? 'Stop' : 'Start',
      className: 'reset',
      updateLabel: (game) => {
        return game.gameActive ? 'Stop' : 'Start'
      },
      onClick: () => {
        if (game.gameActive) game.stop()
        else game.start()
      },
    })
  )

  configsContainer.appendChild(
    Slider({
      label: 'Friction',
      min: 0,
      max: 1,
      step: 0.01,
      value: 1 - game.friction,
      onChange: (value) => {
        game.friction = 1 - value * 0.15
      },
    })
  )

  configsContainer.appendChild(
    Slider({
      label: 'Nudge Force',
      min: 1,
      max: 20,
      step: 1,
      value: game.friction,
      onChange: (value) => {
        game.nudgeForce = value
      },
    })
  )

  configsContainer.appendChild(
    Slider({
      label: 'Bounce Dampening',
      min: 0,
      max: 1,
      step: 0.01,
      value: game.collisionDampening,
      onChange: (value) => {
        game.collisionDampening = value
      },
    })
  )

  configsContainer.appendChild(
    Slider({
      label: 'Actions Per Step',
      min: 1,
      max: 20,
      step: 1,
      value: game.actionsPerStep,
      onChange: (value) => {
        game.actionsPerStep = value
      },
    })
  )

  configsContainer.appendChild(
    Slider({
      label: 'Steps Per Second',
      min: 1,
      max: 120,
      step: 1,
      value: game.stepsPerSecond,
      onChange: (value) => {
        game.stepsPerSecond = value
      },
    })
  )

  configsContainer.appendChild(
    Button({
      text: 'Add Player',
      className: 'add-player',
      onClick: () => {
        game.addPlayer(new RandomPlayer())
      },
    })
  )
}

function Slider({
  label,
  max,
  min,
  step,
  value,
  onChange,
}: {
  min: number
  max: number
  step: number
  value: number
  label: string
  onChange: (value: number) => void
}) {
  const range = document.createElement('input')
  range.type = 'range'
  range.min = min.toString()
  range.max = max.toString()
  range.step = step.toString()
  range.value = value.toString()

  const title = document.createElement('label')
  title.innerText = `${label}`

  const output = document.createElement('span')
  output.innerText = `${range.value}`
  output.className = 'slider-output'

  const container = document.createElement('div')
  container.className = 'input-container'
  container.appendChild(title)
  container.appendChild(range)
  container.appendChild(output)

  range.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement
    onChange(Number(target.value))
    output.innerText = `${range.value}`
  })

  return container
}

function Button({
  text,
  onClick,
  className,
  updateLabel,
}: {
  text: string
  className: string
  onClick: () => void
  updateLabel?: (game: Game) => string
}) {
  const btn = document.createElement('button')
  btn.innerText = text
  btn.className = className
  btn.addEventListener('click', onClick)
  btn.type = 'button'

  if (updateLabel) {
    setInterval(() => {
      btn.innerText = updateLabel(window.game)
    }, UPDATE_INTERVAL)
  }

  return btn
}

function Radio({
  label,
  name,
  id,
  value,
  onClick,
}: {
  id: string
  name: string
  label: string
  value: string
  onClick?: () => void
}) {
  const $wrapper = document.createElement('div')
  $wrapper.className = 'radio-wrapper'

  const $input = document.createElement('input')
  $input.type = 'radio'
  $input.id = id
  $input.value = value
  $input.name = name

  const $label = document.createElement('label')
  $label.innerText = label
  $label.htmlFor = id
  if (onClick) $label.addEventListener('click', onClick)

  $wrapper.append($input, $label)

  return $wrapper
}
