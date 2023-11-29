export async function changeThemeColor(imageSrc: string) {
  try {
    const color = await getImageAverageColor(imageSrc)
    const metaElement = document.querySelector('meta[name="theme-color"]')!
    metaElement.setAttribute('content', color)
    // @ts-ignore
    document.querySelector('.title')!.style = `color: ${color}`
    // titleContent.classList.add('')
    document.getElementById('app-content')!.classList.add('invert-color')
  } catch (error) {
      console.error(error)
  }
}

const MAX_POINT_COUNT = 1000

async function getImageAverageColor(imageSrc: string) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  const imageElement = await loadImage(imageSrc)
  canvas.width = imageElement.naturalWidth
  canvas.height = imageElement.naturalHeight
  context.drawImage(imageElement, 0, 0)

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const imagePixelData = imageData.data

  const pixelCount = imagePixelData.length / 4
  const averRgba = {r: 0, g: 0, b: 0, a: 0}
  // step to calculate average color, to avoid too many calculations
  const step = Math.ceil(pixelCount / MAX_POINT_COUNT)
  for (let i = 0; i < pixelCount; i += step) {
    let idx = i * 4
    averRgba.r += imagePixelData[idx]
    averRgba.g += imagePixelData[idx + 1]
    averRgba.b += imagePixelData[idx + 2]
    averRgba.a += imagePixelData[idx + 3]
  }
  averRgba.r = Math.floor(averRgba.r / pixelCount)
  averRgba.g = Math.floor(averRgba.g / pixelCount)
  averRgba.b = Math.floor(averRgba.b / pixelCount)
  averRgba.a = Math.floor(averRgba.a / pixelCount)

  return`rgba(${averRgba.r}, ${averRgba.g}, ${averRgba.b}, ${averRgba.a / 255})`
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    // fix canvas cors issues
    image.crossOrigin = ''
    image.onload = () => resolve(image)
    image.onerror = (e) => reject(e)
    image.src = src
  })
}