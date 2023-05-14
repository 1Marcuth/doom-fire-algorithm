import fireColorsPalette from "./fire-colors-palette.js"

const firePixels = []

const fireSize = {
    width: 60,
    height: 40
}

const fireScreenPropagationUpdate = 50

let debugMode = false
let limitFire = 36

function start() {
    createFireDataStructure()
    renderFire()

    setInterval(calculateFirePropagation, fireScreenPropagationUpdate)
}

function createFireDataStructure() {
    const numberOfPixels = fireSize.width * fireSize.height

    for (let i = 0; i < numberOfPixels; i++) {
        firePixels[i] = 0
    }

    createFireSource()
}

function calculateFirePropagation() {
    for (let column = 0; column < fireSize.width; column++) {
        for (let row = 0; row < fireSize.height; row++) {
            const pixelIndex = column + (fireSize.width * row)
            updateFireIntensityPerPixel(pixelIndex)
        }
    }

    renderFire()
}

function updateFireIntensityPerPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + fireSize.width

    if (belowPixelIndex >= fireSize.width * fireSize.height) return

    const dcay = Math.floor(Math.random() * 3)
    const belowPixelFireIntensity = firePixels[belowPixelIndex]
    const newFireIntensity = belowPixelFireIntensity - dcay >= 0 ? belowPixelFireIntensity - dcay : 0

    firePixels[currentPixelIndex - dcay] = newFireIntensity
}

function createFireSource() {
    for (let column = 0; column < fireSize.width; column++) {
        const overflowPixelIndex = fireSize.width * fireSize.height
        const pixelIndex = (overflowPixelIndex - fireSize.width) + column

        firePixels[pixelIndex] = Math.round(limitFire)
    }
}

function renderFire() {
    const $fireScreen = document.querySelector("#fire-screen")

    let html = "<table cellpadding=0 cellspacing=0>"

    for (let row = 0; row < fireSize.height; row++) {
        html += "<tr>"

        for (let column = 0; column < fireSize.width; column++) {
            const pixelIndex = column + (row * fireSize.width)
            const fireIntensity = firePixels[pixelIndex]
            const color = fireColorsPalette[fireIntensity]
                const colorString = `${color.r}, ${color.g}, ${color.b}`

            if (debugMode) {
                html += `<td style="color: rgb(${colorString})">`
            
                html += `<div class="pixel-index">${pixelIndex}</div>`
                html += fireIntensity

                html += "</td>"
            } else {
                html += `<td class="pixel" style="background-color: rgb(${colorString})">`
                html += "</td>"
            }
        }

        html += "</tr>"
    }

    html += "</table>"

    $fireScreen.innerHTML = html
}

const $toggleDebugMode = document.querySelector("#toggle-debug-mode")
const $decreaseFire = document.querySelector("#decrease-fire")
const $minFire = document.querySelector("#min-fire")
const $increaseFire = document.querySelector("#increase-fire")
const $maxFire = document.querySelector("#max-fire")

function toggleDebugMode() {
    debugMode = debugMode ? false : true
}

function incraseFire() {
    if (limitFire >= 36) return

    limitFire += 3.6

    createFireSource()
}

function decraseFire() {
    if (limitFire <= 0) return

    limitFire -= 3.6

    createFireSource()
}

function minFire() {
    limitFire = 0

    createFireSource()
}

function maxFire() {
    limitFire = 36

    createFireSource()
}

$toggleDebugMode.addEventListener("click", (event) => toggleDebugMode())
$increaseFire.addEventListener("click", (event) => incraseFire())
$minFire.addEventListener("click", (event) => minFire())
$decreaseFire.addEventListener("click", (event) => decraseFire())
$maxFire.addEventListener("click", (event) => maxFire())

start()