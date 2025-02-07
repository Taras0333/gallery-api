const createTokenUser = (user) => {
  return { firstName: user.firstName, id: user.id }
}

module.exports = createTokenUser
