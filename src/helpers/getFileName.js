export default (path) => {
  const segments = path.split('/')
  return segments[segments.length - 1]
}