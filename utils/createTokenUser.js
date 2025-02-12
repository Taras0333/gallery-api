const createTokenUser = (user) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    email: user.email,
  }
}

module.exports = createTokenUser
