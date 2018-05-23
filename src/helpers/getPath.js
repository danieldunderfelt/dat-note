export default (base, ...segments) => {
  const endsInSlash = base.endsWith('/')
  return `${base}${ !endsInSlash ? '/' : '' }${segments.join('/')}`
}