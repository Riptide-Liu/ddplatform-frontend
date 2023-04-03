
const getters = {
  token: state => state.token,
  userInfo: state => state.user_info,
  introduction: state => state.introduction,
  roles: state => state.roles,
  $text: state => state.text,
  $constant: state => state.constant,
}
export default getters
