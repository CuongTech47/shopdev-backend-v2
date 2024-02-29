const { getUserLoginInfo } = require("./redis.service");

class UserService {
  static loadUser = async ({ userId }) => {
    const userDataString = await getUserLoginInfo(userId);

    const userData = JSON.parse(userDataString);

    return {
      user: userData,
    };
  };
}

module.exports = UserService;
