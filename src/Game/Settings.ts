import type { Game } from './Game'

export function Settings(game: Game) {
  const settingsContainer = document.getElementById('settings-container')!

  settingsContainer.appendChild(
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

  settingsContainer.appendChild(
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

  settingsContainer.appendChild(
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

  settingsContainer.appendChild(
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

  settingsContainer.appendChild(
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
