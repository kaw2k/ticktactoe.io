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
  title.innerText = `${label}: ${range.value}`

  const container = document.createElement('div')
  container.className = 'input-container'
  container.appendChild(title)
  container.appendChild(range)

  range.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement
    onChange(Number(target.value))
    title.innerText = `${label}: ${range.value}`
  })

  return container
}
