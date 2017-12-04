import Tone from 'tone'

const grey= '#594F4F'
const lightBlue = '#45ADA8'
const darkBlue = '#547980'
const green = '#9DE0AD'
const yellow = '#E5FCC2'
const red = '#FC9D9A'

export const sketch = (p5) => {
  const canvasWidth = p5.windowWidth
  const canvasHeight = p5.windowHeight
  window.p5 = p5

  // tone setup
  const baseFilterCutoff = 700
  let synth = new Tone.Synth()
  let reverb = new Tone.Freeverb(0.6).toMaster()
  let dlay = new Tone.FeedbackDelay("16n", 0.8).connect(reverb)
  let filter = new Tone.Filter(baseFilterCutoff, "lowpass").connect(dlay)
  synth.connect(filter)
  const modulateSynth = makeModulateSynth(synth, filter, baseFilterCutoff)
  
  const drawFace = face(p5)
  let noiseOffset = 0
  let noise = 0
  let isSinging = false
  
  p5.setup = () => {
    let canvas = p5.createCanvas(canvasWidth, canvasHeight)
    p5.frameRate(30)
    p5.background(grey)
  }

  p5.draw = () => {
    noiseOffset += 0.1
    noise = p5.noise(noiseOffset)
    
    p5.background(p5.lerpColor(p5.color(red), p5.color(yellow), (1 - p5.mouseY / canvasWidth)))

    drawFace(p5.mouseX, p5.mouseY, noise, isSinging)

    if (isSinging) modulateSynth(noise, (1 - p5.mouseY / canvasHeight))
  }

  p5.mouseClicked = () => {
    isSinging = !isSinging

    if (isSinging) {
      // playSound(noise)
      synth.triggerAttack()
    } else {
      synth.triggerRelease()
    }
    
  }
}

const makeModulateSynth = (synth, filter, baseCutoff) => (noise, x) => {
  synth.set({frequency: 50 + (x * 1200)})
  filter.set({frequency: baseCutoff * noise})
}

const face = p5 => {
  let offset = 0
  
  const f = (x, y, noise, isSinging) => {
    const n = 1
    const r = 150
    const rr = isSinging ? noise * r : 1

    // draw mouth
    p5.fill(yellow)
    p5.stroke(red)
    p5.strokeWeight(6)
    p5.ellipse(x, y, r, rr)

    // draw eyes
    p5.fill(green)
    p5.stroke(darkBlue)
    p5.arc(x - r, y - r, 80, 80, p5.PI, 0, p5.CHORD)
    p5.arc(x + r, y - r, 80, 80, p5.PI, 0, p5.CHORD)

    p5.stroke(darkBlue)
    p5.fill(grey)
    p5.arc(x - r, y - r, 40, 40, p5.PI, 0, p5.OPEN)
    p5.arc(x + r, y - r, 40, 40, p5.PI, 0, p5.OPEN)
  }

  return f
}
