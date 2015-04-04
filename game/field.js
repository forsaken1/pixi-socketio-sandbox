var Field = function(type) {
  $field = this
  this.type = type
  this.wall = type == '#' || type == '&' || type == '$'
  
  this.is_wall = function() {
    return $field.wall
  }

  this.not_wall = function() {
    return ! $field.wall
  }
}

module.exports = Field