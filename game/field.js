function Field(type) {
  if (!(this instanceof Field)) {
    return new Field(type);
  }
  this.type = type
  this.wall = type == '#' || type == '&' || type == '$'
}

Field.prototype.is_wall = function() {
  return this.wall
}

Field.prototype.not_wall = function() {
  return ! this.wall
}

module.exports = Field