import jwtDecode from 'jwt-decode';

export const mapToUserFromAcessToken = (accessToken) => {
  const jwt = jwtDecode(accessToken);

  return {
    userId: jwt.attributes.userId,
    email: jwt.user.email,
    firstName: jwt.user.firstName,
    middleName: jwt.user.middleName,
    lastName: jwt.user.lastName,
    isAdmin: jwt.attributes.isAdmin,
    isActive: jwt.attributes.isActive
  };
};
