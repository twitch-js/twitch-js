String.prototype.capitalize = function() {
  if (this.includes('_')) {
    let split = this.split('_')
    for (let s in split) {
      split[s] =
        split[s].substring(0, 1) +
        split[s].substring(1, split[s].length).toLowerCase()
    }
    return split.join(' ')
  } else {
    return this.substring(0, 1) + this.substring(1, this.length).toLowerCase()
  }
}
