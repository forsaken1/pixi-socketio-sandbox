function Task() {
  if (!(this instanceof Task)) {
    return new Task();
  }
}

module.exports = Task